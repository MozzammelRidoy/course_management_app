export type TStudentSignupPayload = {
  instituteId: string
  email: string
  phone: string
  password: string
  name: string
}

export type TTeacherSignupPayload = {
  instituteId: string
  courseId: string
  email: string
  phone: string
  password: string
  name: string
}
