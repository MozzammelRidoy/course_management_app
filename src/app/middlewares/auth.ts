import config from '../config'
import AppError from '../errors/AppError'
import catchAsync from '../utils/catchAsync'
import { verifyToken } from '../utils/commonUtils'
import { TJwtPayload } from '../interfaces/jwtToken_interface'
import { Role } from '../../generated/prisma/enums'
import { user_findByID_fromDB_or_Cache } from '../modules/users/users_service'
import { UsersModel } from '../../generated/prisma/models'
import { delete_cache_from_RAM } from '../utils/node_cache'

// initiate authentication route auth function
const auth = (...rolesAndFlags: Array<Role | boolean>) => {
  // Check if the last argument is a boolean flag
  let isIgnoreAuthentication = false
  if (typeof rolesAndFlags[rolesAndFlags.length - 1] === 'boolean') {
    isIgnoreAuthentication = rolesAndFlags.pop() as boolean
  }

  // The remaining arguments are the required roles
  const requiredRoles = rolesAndFlags as Role[]
  return catchAsync(async (req, res, next) => {
    // Skip authentication if flag is set
    if (isIgnoreAuthentication) {
      return next()
    }
    // Extract token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(
        401,
        'UNAUTHORIZED',
        'You are not authorized. No token provided.'
      )
    }
    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = verifyToken(token, config.jwt_access_token_secret as string)
    const { user_id, role, iat } = decoded

    // Check if user exists (implementation depends on your user model)
    const user: UsersModel = await user_findByID_fromDB_or_Cache(user_id)

    // Check if user role matches
    if (user.role !== role) {
      throw new AppError(403, 'FORBIDDEN', 'Invalid user role!')
    }
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

    // Check if user has required role
    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(
        403,
        'FORBIDDEN',
        'You do not have permission to perform this action.'
      )
    }
    // Attach user to request object
    req.user = decoded as TJwtPayload
    next()
  })
}
export default auth
