"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoModuleRoutes = void 0;
/**
 * Demo Module Routes
 * Defines routes for demo modules
 */
const express_1 = require("express");
const demo_modules_controller_1 = require("./demo_modules_controller");
// import { validateRequest } from '../../middlewares/validateRequest';
// import { createDemoModuleSchema, updateDemoModuleSchema } from './demo_modules_validationZodSchema';
const router = (0, express_1.Router)();
// Create demo module
/**
router.post(
  '/create',
  validateRequest(createDemoModuleSchema),
  DemoModuleControllers.createDemoModule
);
*/
// Get all demo modules
router.get('/', demo_modules_controller_1.DemoModuleControllers.fetch_DemoData);
// Get demo module by ID
/**
router.get(
  '/:id',
  DemoModuleControllers.getDemoModuleById
);
*/
// Update demo module
/**
router.patch(
  '/:id/update',
  validateRequest(updateDemoModuleSchema),
  DemoModuleControllers.updateDemoModule
);
*/
// Delete demo module
/**
router.delete(
  '/:id/delete',
  DemoModuleControllers.deleteDemoModule
);
*/
exports.DemoModuleRoutes = router;
