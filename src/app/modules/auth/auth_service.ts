import { UsersModel } from '../../../generated/prisma/models'
import config from '../../config'
import AppError from '../../errors/AppError'
import { TJwtPayload } from '../../interfaces/jwtToken_interface'
import { prisma } from '../../shared/prisma'
import {
  check_Input_isPhone_Or_isEmail,
  createToken
} from '../../utils/commonUtils'
import bcrypt from 'bcryptjs'
import { create_cache_into_RAM } from '../../utils/node_cache'

// user login from database
const LoginUser_IntoDB = async (payload: {
  credential: string
  password: string
}) => {
  const credential = check_Input_isPhone_Or_isEmail(payload.credential)

  const whereClause =
    credential.type === 'email'
      ? { email: payload.credential }
      : { phone: payload.credential }

  //checking if the user is exits in the database.
  let user: UsersModel | null = null

  user = await prisma.users.findUnique({
    where: {
      ...whereClause,
      isDeleted: false
    }
  })

  if (!user) {
    throw new AppError(
      404,
      '',
      'User not found. Please register or check your credentials.'
    )
  }

  if (!user.isActive) {
    throw new AppError(
      403,
      '',
      'Your account has been blocked. Please contact support for assistance.'
    )
  }

  if (
    !payload.password ||
    !(await bcrypt.compare(payload.password, user.password))
  ) {
    throw new AppError(403, '', 'Incorrect password. Please try again.')
  }

  const jwtPayload: TJwtPayload = {
    user_id: user.id,
    role: user.role
  }
  // create access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expires_in as string
  )
  // create refresh token.
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token_secret as string,
    config.jwt_refresh_token_expires_in as string
  )

  create_cache_into_RAM(user.id, user, 604800)
  return {
    accessToken,
    refreshToken
  }
}

export const AuthServices = {
  LoginUser_IntoDB
}
