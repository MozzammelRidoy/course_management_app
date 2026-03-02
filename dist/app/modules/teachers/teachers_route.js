"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const teachers_controller_1 = require("./teachers_controller");
const router = express_1.default.Router();
// fetch all assigned courses by Techer
router.get('/my-courses', (0, auth_1.default)('TEACHER'), teachers_controller_1.TeacherControllers.get_all_assigned_Courses_byTeacher);
exports.TeacherRoutes = router;
