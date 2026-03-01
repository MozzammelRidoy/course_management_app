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
const router = express_1.default.Router();
router.post('/signup', (0, validateRequest_1.default)(users_validationZodSchema_1.UserValidations.signup_user_ValidationZodSchema), users_controller_1.UserController.signUp_Student);
exports.UserRoutes = router;
