"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherValidations = void 0;
const zod_1 = require("zod");
const courseId_params_ValidationZodSchema = zod_1.z.object({
    params: zod_1.z.object({
        courseId: zod_1.z
            .string({ required_error: 'Course ID is Required!' })
            .uuid({ message: 'Invalid Course ID Format!' })
    })
});
exports.TeacherValidations = {
    courseId_params_ValidationZodSchema
};
