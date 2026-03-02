import { ResultStatus } from '../../../generated/prisma/enums'

export type TResultUpdatePayload = {
  courseId: string
  studentId: string
  result: number
  feedback?: string
  status: ResultStatus
  semester: string
  academicYear: string
  completedAt: Date
}
