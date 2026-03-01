"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validationZodSchema_1 = require("./auth_validationZodSchema");
const auth_controller_1 = require("./auth_controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// user login
router.post('/login', (0, validateRequest_1.default)(auth_validationZodSchema_1.AuthValidations.Auth_LoginUser_ValidationZodSchema), auth_controller_1.AuthControllers.Auth_LoginUser);
// change password
router.post('/change-password', (0, auth_1.default)('ADMIN', 'SUPER_ADMIN', 'STUDENT', 'TEACHER'), (0, validateRequest_1.default)(auth_validationZodSchema_1.AuthValidations.changePassword_ValidationZodSchema), auth_controller_1.AuthControllers.change_Password);
// generate access token from refresh token
router.get('/generate-access-token', auth_controller_1.AuthControllers.generate_AccessToken);
exports.AuthRoutes = router;
