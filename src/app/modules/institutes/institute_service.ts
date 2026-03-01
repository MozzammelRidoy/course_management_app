import { Prisma } from '../../../generated/prisma/client'
import { InstitutesModel } from '../../../generated/prisma/models'
import AppError from '../../errors/AppError'
import { prisma } from '../../shared/prisma'
import { isValidDate } from '../../utils/date_Time_Validation'

// create institute into database
const create_institute_intoDB = async (payload: InstitutesModel) => {
  let establishedAt: Date | null = null
  if (payload.establishedAt) {
    if (!isValidDate(payload.establishedAt)) {
      throw new AppError(
        400,
        'establishedAt',
        'Established date must be a valid date string!'
      )
    }
    establishedAt = new Date(payload.establishedAt)
  }
  const {
    name,
    code,
    description,
    address,
    contact,
    email,
    website,
    isActive
  } = payload

  try {
    const createdData = await prisma.institutes.create({
      data: {
        name,
        email,
        code,
        description,
        address,
        contact,
        website,
        establishedAt,
        isActive
      }
    })

    return createdData
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new AppError(
          409,
          'code',
          `Institute with code '${payload.code}' already exists!`
        )
      }
    }
    // Throw other errors
    throw error
  }
}

export const InstituteServices = {
  create_institute_intoDB
}
