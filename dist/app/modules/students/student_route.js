"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const student_controller_1 = require("./student_controller");
const router = express_1.default.Router();
// fetch my enrolled coures by student.
router.get('/my-courses', (0, auth_1.default)('STUDENT'), student_controller_1.StudentControllers.get_my_courses_byStudent);
exports.StudentRoutes = router;
