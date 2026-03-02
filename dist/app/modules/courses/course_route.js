"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const course_controller_1 = require("./course_controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const course_validationZodSchema_1 = require("./course_validationZodSchema");
const router = express_1.default.Router();
// fetch all courses for based on student.
router.get('/', (0, auth_1.default)('STUDENT'), course_controller_1.CourseControllers.get_Courses_byStudent);
// enrollment course by student.
router.post('/enroll', (0, auth_1.default)('STUDENT'), (0, validateRequest_1.default)(course_validationZodSchema_1.courseValidations.create_course_enrollment_ValidationZodSchema), course_controller_1.CourseControllers.create_enrollment_course_byStudent);
exports.CourseRoutes = router;
