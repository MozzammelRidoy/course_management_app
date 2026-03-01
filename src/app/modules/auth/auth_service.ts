import { UsersModel } from '../../../generated/prisma/models'
import config from '../../config'
import AppError from '../../errors/AppError'
import { TJwtPayload } from '../../interfaces/jwtToken_interface'
import { prisma } from '../../shared/prisma'
import {
  check_Input_isPhone_Or_isEmail,
  createToken,
  verifyToken
} from '../../utils/commonUtils'
import bcrypt from 'bcryptjs'
import {
  create_cache_into_RAM,
  delete_cache_from_RAM
} from '../../utils/node_cache'
import { user_findByID_fromDB_or_Cache } from '../users/users_service'

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

// user change password from database
const change_Password_intoDB = async (
  userData: TJwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // Ensure the new password is different from the old password
  if (payload.oldPassword === payload.newPassword) {
    throw new AppError(
      400,
      '',
      'New password cannot be the same as the old password!'
    )
  }

  const user = await prisma.users.findUnique({
    where: { id: userData.user_id, isDeleted: false }
  })
  if (!user) {
    throw new AppError(404, '', 'User not found.')
  }

  if (!user.isActive) {
    throw new AppError(
      403,
      '',
      'Your account has been blocked. Please contact support for assistance.'
    )
  }

  const isPasswordValid = await bcrypt.compare(
    payload.oldPassword,
    user.password
  )
  if (!isPasswordValid) {
    throw new AppError(403, '', 'Old password is incorrect.')
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 10)

  await prisma.users.update({
    where: { id: userData.user_id },
    data: { password: hashedPassword, passwordChangedAt: new Date() }
  })

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
  delete_cache_from_RAM(user.id)

  return {
    accessToken,
    refreshToken
  }
}

// token genarate from refresh token
const generate_Token_from_RefreshToken = async (token: string) => {
  // Verify token
  const decoded = verifyToken(token, config.jwt_refresh_token_secret as string)
  const { user_id, iat } = decoded

  // Check if user exists (implementation depends on your user model)
  const user: UsersModel = await user_findByID_fromDB_or_Cache(user_id)

  // Check if password was changed after token was issued
  if (user.passwordChangedAt) {
    const passwordChangedTime =
      new Date(user.passwordChangedAt).getTime() / 1000
    const passwordChangedTimeInt = parseInt(passwordChangedTime.toString())

    const isPasswordChanged = passwordChangedTimeInt > iat!
    if (isPasswordChanged) {
      // Clear cache if needed
      delete_cache_from_RAM(user_id)
      throw new AppError(
        401,
        'UNAUTHORIZED',
        'Password has been changed. Please login again.'
      )
    }
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

  return {
    accessToken
  }
}
export const AuthServices = {
  LoginUser_IntoDB,
  change_Password_intoDB,
  generate_Token_from_RefreshToken
}
