import { Prisma } from '../../../generated/prisma/client'
import { InstitutesModel } from '../../../generated/prisma/models'
import PrismaQueryBuilder from '../../builder/PrismaQueryBuilder'
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

// fetch all institutes from database for Admin
const fetch_all_institutes_forAdmin_fromDB = async (
  query: Record<string, unknown>
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isDeleted, ...rest } = query
  if (query.isActive) query.isActive = query.isActive === 'true' ? true : false
  // Pass 'prisma.institutes', NOT 'prisma.institutes.findMany()'
  const instituteQuery = new PrismaQueryBuilder(prisma.institutes, rest)
    .setBaseQuery({ isDeleted: false })
    .setSecretFields(['isDeleted'])
    .search(['name', 'code'])
    .fields()
    .filter()
    .sort()
    .paginate()

  const result = await instituteQuery.execute()
  const meta = await instituteQuery.countTotal()

  return {
    result,
    meta
  }
}

// fetch all institutes from database for All global

const fetch_all_institutes_forGlobal_fromDB = async (
  query: Record<string, unknown>
) => {
  const instituteQuery = new PrismaQueryBuilder(prisma.institutes, query)
    .setBaseQuery({ isDeleted: false, isActive: true })
    .setSecretFields(['isDeleted', 'isActive'])
    .search(['name', 'code'])
    .fields()
    .filter()
    .sort()
    .paginate()

  const result = await instituteQuery.execute()
  const meta = await instituteQuery.countTotal()

  return {
    result,
    meta
  }
}
export const InstituteServices = {
  create_institute_intoDB,
  fetch_all_institutes_forAdmin_fromDB,
  fetch_all_institutes_forGlobal_fromDB
}
