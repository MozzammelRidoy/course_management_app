import { CourseLevel, CourseStatus } from '../../../generated/prisma/enums'

export type TCoursePayload = {
  instituteId: string
  code: string
  name: string
  description: string
  credits: number
  duration: number
  category: string
  level: CourseLevel
  startDate: Date
  endDate: Date
  status: CourseStatus
  isAvailable: boolean
  isDeleted?: boolean
}
