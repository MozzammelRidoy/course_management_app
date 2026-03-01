import { TCoursePayload } from './course_interface'

// course create by admin
const create_course_byAdmin_intoDB = async (payload: TCoursePayload) => {
  console.log(payload)
}

export const CourseServices = {
  create_course_byAdmin_intoDB
}
