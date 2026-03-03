"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("./users_controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const users_validationZodSchema_1 = require("./users_validationZodSchema");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Student Signup
router.post('/signup', (0, validateRequest_1.default)(users_validationZodSchema_1.UserValidations.signup_user_ValidationZodSchema), users_controller_1.UserController.signUp_Student);
// fetch my own profile
router.get('/me', (0, auth_1.default)('ADMIN', 'STUDENT', 'SUPER_ADMIN', 'TEACHER'), users_controller_1.UserController.get_ownProfile);
exports.UserRoutes = router;
