"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstituteRoutes = void 0;
const express_1 = __importDefault(require("express"));
const institute_controller_1 = require("./institute_controller");
const router = express_1.default.Router();
// fetch all institutes for Global.
router.get('/', institute_controller_1.InstituteController.get_All_institutes_forGlobal);
exports.InstituteRoutes = router;
