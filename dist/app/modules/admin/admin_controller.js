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
exports.AdminControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const admin_service_1 = require("./admin_service");
// fetch student result per institute
const fetch_Student_Result_PerInstitute_byAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.report_student_result_per_institue_byAdmin_fromDB(req.params.instituteId, req.query);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: 'Student result fetched successfully',
        data: result.data,
        meta: result.meta
    });
}));
// fetct top courses per year byAdmin
const fetch_Top_Courses_perYear_byAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.report_top_courses_perYear_byAdmin_fromDB(req.query);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: 'Top courses fetched successfully',
        data: result
    });
}));
// fetch top ranking student by admin.
const fetch_topRanking_Student_byAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.report_Top_ranking_Student_byAdmin_fromDB(req.query);
    (0, sendResponse_1.default)(res, {
        status: 200,
        success: true,
        message: 'Top ranking student fetched successfully',
        data: result
    });
}));
// seed insert million data
const seed_insert_million_data = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_service_1.AdminServices.insert_million_data_via_seed_function_intoDB(req.body.startNumber, req.body.endNumber);
    (0, sendResponse_1.default)(res, {
        status: 201,
        success: true,
        message: 'Data inserted successfully',
        data: result
    });
}));
exports.AdminControllers = {
    fetch_Student_Result_PerInstitute_byAdmin,
    fetch_Top_Courses_perYear_byAdmin,
    fetch_topRanking_Student_byAdmin,
    seed_insert_million_data
};
