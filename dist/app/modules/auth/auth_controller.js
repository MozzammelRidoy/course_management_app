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
exports.AuthControllers = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth_service");
// user login
const Auth_LoginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.LoginUser_IntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: 'User logged in successfully',
        data: result
    });
}));
// change password
const change_Password = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthServices.change_Password_intoDB(req.user, req.body);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: 'Password changed successfully',
        data: result
    });
}));
// generate access token from refresh token
const generate_AccessToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[3];
    if (!token) {
        throw new AppError_1.default(401, 'UNAUTHORIZED', 'You are not authorized. No token provided.');
    }
    const result = yield auth_service_1.AuthServices.generate_Token_from_RefreshToken(token);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: 'Access token generated successfully',
        data: result
    });
}));
exports.AuthControllers = {
    Auth_LoginUser,
    change_Password,
    generate_AccessToken
};
