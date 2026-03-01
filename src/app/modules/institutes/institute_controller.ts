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

// fetch all institutes for Admin
const get_All_institutes_forAdmin = catchAsync(async (req, res) => {
  const result = await InstituteServices.fetch_all_institutes_forAdmin_fromDB(
    req.query
  )

  sendResponse(res, {
    status: 200,
    success: true,
    message: 'All institutes fetched successfully',
    data: result.data,
    meta: result.meta
  })
})

export const InstituteController = {
  create_institute,
  get_All_institutes_forAdmin
}
