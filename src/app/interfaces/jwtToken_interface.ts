import { Role } from '../../generated/prisma/enums'

/**
 * JWT Payload Interface
 * Defines the structure of the JWT payload used in authentication
 */
export type TJwtPayload = {
  user_id: string
  role: Role
}
