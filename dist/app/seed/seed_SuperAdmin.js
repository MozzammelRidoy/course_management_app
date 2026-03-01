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
exports.seed_SuperAdmin_Create = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../shared/prisma");
const config_1 = __importDefault(require("../config"));
// Super Admin seeding function
const seed_SuperAdmin_Create = () => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcryptjs_1.default.hash(config_1.default.admin_password, config_1.default.bcrypt_salt_rounds);
    // Define User Payload
    const superAdminPayload = {
        email: config_1.default.admin_email,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
        isDeleted: false
    };
    // Define Profile Payload
    const superAdminProfile = {
        name: 'Super Admin'
    };
    // Perform Upsert
    yield prisma_1.prisma.users.upsert({
        where: { email: config_1.default.admin_email },
        // User exists
        update: Object.assign(Object.assign({}, superAdminPayload), { profile: {
                upsert: {
                    create: superAdminProfile,
                    update: superAdminProfile
                }
            } }),
        // User does not exist
        create: Object.assign(Object.assign({}, superAdminPayload), { profile: {
                create: superAdminProfile
            } }),
        include: {
            profile: true
        }
    });
    return { message: 'Super Admin seeded successfully' };
});
exports.seed_SuperAdmin_Create = seed_SuperAdmin_Create;
