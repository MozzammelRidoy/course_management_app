import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { InstituteServices } from './institute_service'

// craate institute controller
const create_institute = catchAsync(async (req, res) => {
  const result = await InstituteServices.create_institute_intoDB(req.body)

  sendResponse(res, {
    status: 201,
    success: true,
    message: 'Institute created successfully',
    data: result
  })
})

export const InstituteController = {
  create_institute
}
