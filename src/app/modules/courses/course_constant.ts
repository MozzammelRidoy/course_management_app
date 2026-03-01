import { CourseLevel, CourseStatus } from '../../../generated/prisma/enums'

export const CourseLevelValues: CourseLevel[] = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT'
] as const

export const CourseStatusValues: CourseStatus[] = [
  'PENDING',
  'ONGOING',
  'ENDED'
] as const
