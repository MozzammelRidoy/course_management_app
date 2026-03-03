"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const users_service_1 = require("./users_service");
// create user user
const signUp_Student = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_service_1.UserServices.signup_student_intoDB(req.body);
    (0, sendResponse_1.default)(res, {
        status: 201,
        success: true,
        message: 'User created successfully',
        data: result
    });
}));
// create teacher profile by admin.
const create_teacher_profile_byAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_service_1.UserServices.create_Teacher_byAmin_intoDB(req.body);
    (0, sendResponse_1.default)(res, {
        status: 201,
        success: true,
        message: 'Teacher created successfully',
        data: result
    });
}));
// fetch own profile
const get_ownProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield users_service_1.UserServices.fetch_ownProfile_fromDB(req.user);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: 'Profile fetched successfully',
        data: result
    });
}));
exports.UserController = {
    signUp_Student,
    create_teacher_profile_byAdmin,
    get_ownProfile
};
