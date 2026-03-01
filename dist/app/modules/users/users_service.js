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
exports.UserServices = exports.user_findByID_fromDB_or_Cache = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = require("../../shared/prisma");
const node_cache_1 = require("../../utils/node_cache");
const user_findByID_fromDB_or_Cache = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let value = (0, node_cache_1.get_cache_from_RAM)(userId);
    if (value === undefined) {
        const user = yield prisma_1.prisma.users.findUnique({
            where: { id: userId, isDeleted: false }
        });
        if (!user) {
            throw new AppError_1.default(404, 'not-found', 'This user is not found!');
        }
        if (!user.isActive) {
            throw new AppError_1.default(403, '', 'This user is already blocked!');
        }
        value = user;
        (0, node_cache_1.create_cache_into_RAM)(userId, value, 604800);
    }
    return value;
});
exports.user_findByID_fromDB_or_Cache = user_findByID_fromDB_or_Cache;
const create_user_intDB = () => __awaiter(void 0, void 0, void 0, function* () { });
exports.UserServices = {
    create_user_intDB
};
