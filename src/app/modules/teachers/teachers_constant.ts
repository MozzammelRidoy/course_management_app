import { ResultStatus } from '../../../generated/prisma/enums'

export const ResultStatusValues: ResultStatus[] = [
  'ENROLLED',
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED',
  'WITHDRAWN'
] as const
