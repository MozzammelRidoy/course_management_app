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
exports.AuthServices = void 0;
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../shared/prisma");
const commonUtils_1 = require("../../utils/commonUtils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const node_cache_1 = require("../../utils/node_cache");
const users_service_1 = require("../users/users_service");
// user login from database
const LoginUser_IntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const credential = (0, commonUtils_1.check_Input_isPhone_Or_isEmail)(payload.credential);
    const whereClause = credential.type === 'email'
        ? { email: payload.credential }
        : { phone: payload.credential };
    //checking if the user is exits in the database.
    let user = null;
    user = yield prisma_1.prisma.users.findUnique({
        where: Object.assign(Object.assign({}, whereClause), { isDeleted: false })
    });
    if (!user) {
        throw new AppError_1.default(404, '', 'User not found. Please register or check your credentials.');
    }
    if (!user.isActive) {
        throw new AppError_1.default(403, '', 'Your account has been blocked. Please contact support for assistance.');
    }
    if (!payload.password ||
        !(yield bcryptjs_1.default.compare(payload.password, user.password))) {
        throw new AppError_1.default(403, '', 'Incorrect password. Please try again.');
    }
    const jwtPayload = {
        user_id: user.id,
        role: user.role
    };
    // create access token
    const accessToken = (0, commonUtils_1.createToken)(jwtPayload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expires_in);
    // create refresh token.
    const refreshToken = (0, commonUtils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_token_secret, config_1.default.jwt_refresh_token_expires_in);
    (0, node_cache_1.create_cache_into_RAM)(user.id, user, 604800);
    return {
        accessToken,
        refreshToken
    };
});
// user change password from database
const change_Password_intoDB = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the new password is different from the old password
    if (payload.oldPassword === payload.newPassword) {
        throw new AppError_1.default(400, '', 'New password cannot be the same as the old password!');
    }
    const user = yield prisma_1.prisma.users.findUnique({
        where: { id: userData.user_id, isDeleted: false }
    });
    if (!user) {
        throw new AppError_1.default(404, '', 'User not found.');
    }
    if (!user.isActive) {
        throw new AppError_1.default(403, '', 'Your account has been blocked. Please contact support for assistance.');
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(payload.oldPassword, user.password);
    if (!isPasswordValid) {
        throw new AppError_1.default(403, '', 'Old password is incorrect.');
    }
    const hashedPassword = yield bcryptjs_1.default.hash(payload.newPassword, 10);
    yield prisma_1.prisma.users.update({
        where: { id: userData.user_id },
        data: { password: hashedPassword, passwordChangedAt: new Date() }
    });
    const jwtPayload = {
        user_id: user.id,
        role: user.role
    };
    // create access token
    const accessToken = (0, commonUtils_1.createToken)(jwtPayload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expires_in);
    // create refresh token.
    const refreshToken = (0, commonUtils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_token_secret, config_1.default.jwt_refresh_token_expires_in);
    (0, node_cache_1.delete_cache_from_RAM)(user.id);
    return {
        accessToken,
        refreshToken
    };
});
// token genarate from refresh token
const generate_Token_from_RefreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify token
    const decoded = (0, commonUtils_1.verifyToken)(token, config_1.default.jwt_refresh_token_secret);
    const { user_id, iat } = decoded;
    // Check if user exists (implementation depends on your user model)
    const user = yield (0, users_service_1.user_findByID_fromDB_or_Cache)(user_id);
    // Check if password was changed after token was issued
    if (user.passwordChangedAt) {
        const passwordChangedTime = new Date(user.passwordChangedAt).getTime() / 1000;
        const passwordChangedTimeInt = parseInt(passwordChangedTime.toString());
        const isPasswordChanged = passwordChangedTimeInt > iat;
        if (isPasswordChanged) {
            // Clear cache if needed
            (0, node_cache_1.delete_cache_from_RAM)(user_id);
            throw new AppError_1.default(401, 'UNAUTHORIZED', 'Password has been changed. Please login again.');
        }
    }
    const jwtPayload = {
        user_id: user.id,
        role: user.role
    };
    // create access token
    const accessToken = (0, commonUtils_1.createToken)(jwtPayload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expires_in);
    return {
        accessToken
    };
});
exports.AuthServices = {
    LoginUser_IntoDB,
    change_Password_intoDB,
    generate_Token_from_RefreshToken
};
