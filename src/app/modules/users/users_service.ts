/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from '../../../generated/prisma/client'
import config from '../../config'
import AppError from '../../errors/AppError'
import { TJwtPayload } from '../../interfaces/jwtToken_interface'
import { prisma } from '../../shared/prisma'
import { createToken } from '../../utils/commonUtils'
import {
  create_cache_into_RAM,
  get_cache_from_RAM
} from '../../utils/node_cache'
import bcrypt from 'bcryptjs'
import { TStudentSignupPayload, TTeacherSignupPayload } from './users_interface'

export const user_findByID_fromDB_or_Cache = async (userId: string) => {
  let value = get_cache_from_RAM(userId)

  if (value === undefined) {
    const user = await prisma.users.findUnique({
      where: { id: userId, isDeleted: false }
    })
    if (!user) {
      throw new AppError(404, 'not-found', 'This user is not found!')
    }

    if (!user.isActive) {
      throw new AppError(403, '', 'This user is already blocked!')
    }

    value = user
    create_cache_into_RAM(userId, value, 604800)
  }
  return value
}

// signup a student into db.

const signup_student_intoDB = async (payload: TStudentSignupPayload) => {
  const { name, instituteId, email, phone, password } = payload
  const {
    bcrypt_salt_rounds,
    jwt_access_token_secret,
    jwt_access_token_expires_in,
    jwt_refresh_token_secret,
    jwt_refresh_token_expires_in
  } = config

  // Check if User Already Exists
  const existingUser = await prisma.users.findFirst({
    where: {
      OR: [{ email }, { phone }]
    }
  })

  if (existingUser) {
    const field = existingUser.email === email ? 'email' : 'phone'
    throw new AppError(409, field, `This ${field} is already registered!`)
  }

  // Check Institute Validity
  const institute = await prisma.institutes.findUnique({
    where: { id: instituteId, isActive: true, isDeleted: false }
  })

  if (!institute) {
    throw new AppError(
      404,
      'instituteId',
      'Institute not found or is currently unavailable.'
    )
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, Number(bcrypt_salt_rounds))

  try {
    // Create User & Profile & Student in a Transaction
    const createdUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        phone,
        isActive: true,
        isDeleted: false,
        role: 'STUDENT',
        profile: {
          create: { name }
        },
        student: {
          create: { instituteId }
        }
      }
    })

    // Prepare JWT Payload
    const jwtPayload: TJwtPayload = {
      user_id: createdUser.id,
      role: createdUser.role
    }

    // Generate Tokens
    const accessToken = createToken(
      jwtPayload,
      jwt_access_token_secret as string,
      jwt_access_token_expires_in as string
    )

    const refreshToken = createToken(
      jwtPayload,
      jwt_refresh_token_secret as string,
      jwt_refresh_token_expires_in as string
    )

    create_cache_into_RAM(createdUser.id, createdUser, 604800)

    return {
      accessToken,
      refreshToken
    }
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new AppError(
          409,
          'user',
          `Failed Sign-Up! This user already Registered!`
        )
      }
    }
    // Re-throw other errors
    throw error
  }
}

// create teacher into db by Admin.

const create_Teacher_byAmin_intoDB = async (payload: TTeacherSignupPayload) => {
  const { name, instituteId, email, phone, password, courseId } = payload
  const { bcrypt_salt_rounds } = config

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, Number(bcrypt_salt_rounds))

  try {
    // Create Transaction
    await prisma.$transaction(async tx => {
      // Check if User Already Exists
      const existingUser = await tx.users.findFirst({
        where: {
          OR: [{ email }, { phone }]
        }
      })

      if (existingUser) {
        const field = existingUser.email === email ? 'email' : 'phone'
        throw new AppError(409, field, `This ${field} is already registered!`)
      }

      // Check Institute Validity
      const institute = await tx.institutes.findUnique({
        where: { id: instituteId, isActive: true, isDeleted: false }
      })

      if (!institute) {
        throw new AppError(
          404,
          'instituteId',
          'Institute not found or is currently unavailable.'
        )
      }

      // Check Course Validity
      const course = await tx.courses.findFirst({
        where: {
          id: courseId,
          instituteId: instituteId,
          isDeleted: false,
          status: { in: ['ONGOING', 'PENDING'] }
        }
      })

      if (!course) {
        throw new AppError(
          404,
          'courseId',
          'Course not found, unavailable, or does not belong to this institute.'
        )
      }

      // Create Teacher Profile
      const createdTeacher = await tx.users.create({
        data: {
          email,
          phone,
          password: hashedPassword,
          role: 'TEACHER',
          isActive: true,
          isDeleted: false,
          profile: {
            create: {
              name
            }
          },
          teacher: {
            create: {
              instituteId,
              courseLinks: {
                create: {
                  courseId
                }
              }
            }
          }
        },

        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true
        }
      })

      return createdTeacher
    })

    return {
      message: 'Teacher Profile Created Successfully'
    }
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new AppError(
          409,
          'user',
          `Failed to create Techer Profile! This user already Registered!`
        )
      }
    }

    // Re-throw AppErrors thrown manually inside transaction
    if (error instanceof AppError) throw error

    // Generic fallback
    throw new AppError(400, '', 'Failed to create teacher profile.')
  }
}
export const UserServices = {
  signup_student_intoDB,
  create_Teacher_byAmin_intoDB
}
