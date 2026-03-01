"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const institute_validationZodSchema_1 = require("./institute_validationZodSchema");
const institute_controller_1 = require("./institute_controller");
const router = express_1.default.Router();
// create institute by Admin.
router.post('/create', (0, auth_1.default)('SUPER_ADMIN', 'ADMIN'), (0, validateRequest_1.default)(institute_validationZodSchema_1.InstituteValidations.create_institute_validationZodSchema), institute_controller_1.InstituteController.create_institute);
exports.InstituteRoutes = router;
