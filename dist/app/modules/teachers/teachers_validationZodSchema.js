"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherValidations = void 0;
const zod_1 = require("zod");
const teachers_constant_1 = require("./teachers_constant");
const courseId_params_ValidationZodSchema = zod_1.z.object({
    params: zod_1.z.object({
        courseId: zod_1.z
            .string({ required_error: 'Course ID is Required!' })
            .uuid({ message: 'Invalid Course ID Format!' })
    })
});
const allowResultStatus = teachers_constant_1.ResultStatusValues.filter(v => v !== 'IN_PROGRESS' && v !== 'ENROLLED');
const update_result_ValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        courseId: zod_1.z
            .string({ required_error: 'Course ID is Required!' })
            .uuid({ message: 'Invalid Course ID Format!' })
            .uuid({ message: 'Invalid Course ID Format!' }),
        studentId: zod_1.z
            .string({ required_error: 'Student ID is Required!' })
            .uuid({ message: 'Invalid Student ID Format!' }),
        result: zod_1.z
            .number({ required_error: 'Result is Required!' })
            .min(0, { message: 'Result should be greater than 0!' })
            .max(100, { message: 'Result should be less than 100!' }),
        feedback: zod_1.z
            .string({ required_error: 'Feedback is Required!' })
            .max(200, { message: 'Feedback should be less than 200 characters!' })
            .optional(),
        status: zod_1.z.enum(allowResultStatus, {
            required_error: 'Status is Required!'
        }),
        semester: zod_1.z
            .string({ required_error: 'Semester is Required!' })
            .max(20, { message: 'Semester should be less than 20 characters!' }),
        academicYear: zod_1.z.string({ required_error: 'Academic Year is Required!' }),
        completedAt: zod_1.z
            .string({ required_error: 'End Date is required' })
            .refine(val => !isNaN(Date.parse(val)), 'End Date date must be a valid date string')
    })
});
exports.TeacherValidations = {
    courseId_params_ValidationZodSchema,
    update_result_ValidationZodSchema
};
