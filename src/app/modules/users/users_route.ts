import express from 'express'
import { UserController } from './users_controller'

const router = express.Router()

router.post('/create', UserController.create_user)

export const UserRoutes = router
