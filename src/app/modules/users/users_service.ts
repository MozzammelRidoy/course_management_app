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

type TSignupPayload = {
  instituteId: string
  email: string
  phone: string
  password: string
  name: string
}

const signup_student_intoDB = async (payload: TSignupPayload) => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
export const UserServices = {
  signup_student_intoDB
}
