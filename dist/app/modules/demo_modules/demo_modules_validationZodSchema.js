"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDemoModuleSchema = exports.createDemoModuleSchema = void 0;
/**
 * Demo Module Validation Schemas
 * Zod schemas for validating demo module data
 */
const zod_1 = require("zod");
exports.createDemoModuleSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Name is required' })
            .min(1, 'Name is required')
            .max(100, 'Name cannot exceed 100 characters'),
        description: zod_1.z
            .string()
            .max(500, 'Description cannot exceed 500 characters')
            .optional()
    })
});
exports.updateDemoModuleSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().max(100, 'Name cannot exceed 100 characters').optional(),
        description: zod_1.z
            .string()
            .max(500, 'Description cannot exceed 500 characters')
            .optional()
    })
});
