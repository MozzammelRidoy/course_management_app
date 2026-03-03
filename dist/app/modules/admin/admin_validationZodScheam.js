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
exports.AdminValidations = {
    instituteId_params_ValidationZodSchema
};
