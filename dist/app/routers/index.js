"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth_route");
const institute_route_1 = require("../modules/institutes/institute_route");
const admin_route_1 = require("../modules/admin/admin_route");
/**
 * Main router configuration
 * This file serves as the central point for registering all module routes
 */
const routers = express_1.default.Router();
/**
 * Array of module routes to be registered
 * Each object contains:
 * - path: The base path for the module (e.g., '/auth')
 * - route: The router instance for the module
 */
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes
    },
    {
        path: '/institutes',
        route: institute_route_1.InstituteRoutes
    },
    {
        path: '/admin',
        route: admin_route_1.AdminRoutes
    }
];
/**
 * Register all module routes
 * This loop iterates through the moduleRoutes array and registers each route
 * with its corresponding path
 */
moduleRoutes.forEach(route => {
    routers.use(route.path, route.route);
});
exports.default = routers;
