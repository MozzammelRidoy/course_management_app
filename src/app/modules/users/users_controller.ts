import catchAsync from '../../utils/catchAsync'
import { UserServices } from './users_service'

// create user user
const create_user = catchAsync(async (req, res) => {
  const result = await UserServices.create_user_intDB()
})

export const UserController = {
  create_user
}
