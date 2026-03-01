"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseValidations = void 0;
const zod_1 = require("zod");
const course_constant_1 = require("./course_constant");
// Create Course Validation Schema
const create_course_ValidationZodScheam = zod_1.z.object({
    body: zod_1.z.object({
        instituteId: zod_1.z
            .string({ required_error: 'Institute Id is required' })
            .uuid({ message: 'Institute Id must be a valid uuid' }),
        code: zod_1.z
            .string({ required_error: 'Code is required' })
            .min(3, { message: 'Code must be at least 3 characters long' })
            .max(120, { message: 'Code Must be at most 120 characters long' }),
        name: zod_1.z
            .string({ required_error: 'Name is required' })
            .min(3, { message: 'Name must be at least 3 characters long' })
            .max(240, { message: 'Name Must be at most 240 characters long' }),
        description: zod_1.z
            .string({ required_error: 'Description is required' })
            .min(5, { message: 'Description must be at least 5 characters long' })
            .max(700, 'Description Must be at most 700 characters long')
            .optional(),
        credits: zod_1.z
            .number({ required_error: 'Credits is required' })
            .min(1, { message: 'Credits must be at least 1' })
            .max(40, { message: 'Credits must be at most 40' }),
        duration: zod_1.z
            .number({ required_error: 'Duration is required' })
            .min(1, { message: 'Duration must be at least 1' })
            .max(48, { message: 'Duration must be at most 48' }),
        category: zod_1.z
            .string({ required_error: 'Category is required' })
            .min(3, { message: 'Category must be at least 3 characters long' })
            .max(120, { message: 'Category Must be at most 120 characters long' })
            .optional(),
        level: zod_1.z
            .enum([...course_constant_1.CourseLevelValues], {
            required_error: 'Level is required'
        })
            .optional(),
        startDate: zod_1.z
            .string({ required_error: 'Start Date is required' })
            .refine(val => !isNaN(Date.parse(val)), 'Start Date date must be a valid date string')
            .optional(),
        endDate: zod_1.z
            .string({ required_error: 'End Date is required' })
            .refine(val => !isNaN(Date.parse(val)), 'End Date date must be a valid date string')
            .optional(),
        status: zod_1.z
            .enum([...course_constant_1.CourseStatusValues], {
            required_error: 'Course Status is required'
        })
            .optional(),
        isAvailable: zod_1.z.boolean({
            required_error: 'Course Availability is required'
        })
    })
});
exports.courseValidations = { create_course_ValidationZodScheam };
