"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const institute_controller_1 = require("../institutes/institute_controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const institute_validationZodSchema_1 = require("../institutes/institute_validationZodSchema");
const users_validationZodSchema_1 = require("../users/users_validationZodSchema");
const users_controller_1 = require("../users/users_controller");
const course_validationZodSchema_1 = require("../courses/course_validationZodSchema");
const course_controller_1 = require("../courses/course_controller");
const router = express_1.default.Router();
// =================Institute=======================
// fetch all institutes for Admin
router.get('/institutes', (0, auth_1.default)('SUPER_ADMIN', 'ADMIN'), institute_controller_1.InstituteController.get_All_institutes_forAdmin);
// create institute by Admin.
router.post('/institute-create', (0, auth_1.default)('SUPER_ADMIN', 'ADMIN'), (0, validateRequest_1.default)(institute_validationZodSchema_1.InstituteValidations.create_institute_validationZodSchema), institute_controller_1.InstituteController.create_institute);
// ==============Teacher=======================
// create teacher profile by admin.
router.post('/teacher-create', (0, auth_1.default)('SUPER_ADMIN', 'ADMIN'), (0, validateRequest_1.default)(users_validationZodSchema_1.UserValidations.create_teacher_profile_by_admin_ValidationZodSchema), users_controller_1.UserController.create_teacher_profile_byAdmin);
// ===============Course=======================
// fetch course by admin.
router.get('/courses', (0, auth_1.default)('SUPER_ADMIN', 'ADMIN'), course_controller_1.CourseControllers.get_Courses_byAdmin);
// create course by admin.
router.post('/course-create', (0, auth_1.default)('SUPER_ADMIN', 'ADMIN'), (0, validateRequest_1.default)(course_validationZodSchema_1.courseValidations.create_course_ValidationZodScheam), course_controller_1.CourseControllers.create_Course_byAdmin);
// update course by Admin
router.put('/course-update/:courseId', (0, auth_1.default)('SUPER_ADMIN', 'ADMIN'), (0, validateRequest_1.default)(course_validationZodSchema_1.courseValidations.update_course_byAdmin_ValidationZodSchema), course_controller_1.CourseControllers.update_course_byAdmin);
exports.AdminRoutes = router;
