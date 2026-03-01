import express, { Router } from 'express'
import { AuthRoutes } from '../modules/auth/auth_route'
import { InstituteRoutes } from '../modules/institutes/institute_route'
import { AdminRoutes } from '../modules/admin/admin_route'
import { UserRoutes } from '../modules/users/users_route'

/**
 * Main router configuration
 * This file serves as the central point for registering all module routes
 */
const routers: Router = express.Router()

/**
 * Array of module routes to be registered
 * Each object contains:
 * - path: The base path for the module (e.g., '/auth')
 * - route: The router instance for the module
 */
const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes
  },
  {
    path: '/users',
    route: UserRoutes
  },
  {
    path: '/institutes',
    route: InstituteRoutes
  },
  {
    path: '/admin',
    route: AdminRoutes
  }
]

/**
 * Register all module routes
 * This loop iterates through the moduleRoutes array and registers each route
 * with its corresponding path
 */
moduleRoutes.forEach(route => {
  routers.use(route.path, route.route)
})

export default routers
