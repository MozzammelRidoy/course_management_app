import { TJwtPayload } from './jwtToken_interface'

/**
 * Global declaration extending Express Request interface
 * Adds a 'user' property to the Request object when authentication is enabled
 */
declare global {
  namespace Express {
    interface Request {
      /** JWT payload containing user information */
      user: TJwtPayload
    }
  }
}

// Export the extended Request type for convenience
export type AuthenticatedRequest = Express.Request & {
  user: TJwtPayload
}
