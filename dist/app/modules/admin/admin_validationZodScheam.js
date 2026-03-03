"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidations = void 0;
const zod_1 = require("zod");
// institute params validaion
const instituteId_params_ValidationZodSchema = zod_1.z.object({
    params: zod_1.z.object({
        instituteId: zod_1.z
            .string({ required_error: 'Institute Id is Required!' })
            .uuid({ message: 'Institute Id must be a valid Format!' })
    })
});
const insert_million_data_ValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        startNumber: zod_1.z
            .number({ required_error: 'Start Number is Required!' })
            .min(1, { message: 'Start Number must be greater than 0!' })
            .max(1000000, { message: 'Start Number must be less than 1000000!' }),
        endNumber: zod_1.z
            .number({ required_error: 'End Number is Required!' })
            .min(1, { message: 'End Number must be greater than 0!' })
            .max(1000000, { message: 'End Number must be less than 1000000!' })
    })
});
exports.AdminValidations = {
    instituteId_params_ValidationZodSchema,
    insert_million_data_ValidationZodSchema
};
