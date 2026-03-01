import AppError from '../../errors/AppError'
import { prisma } from '../../shared/prisma'
import {
  create_cache_into_RAM,
  get_cache_from_RAM
} from '../../utils/node_cache'

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

const create_user_intDB = async () => {}
export const UserServices = {
  create_user_intDB
}
