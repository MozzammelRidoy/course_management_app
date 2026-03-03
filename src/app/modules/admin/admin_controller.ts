import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AdminServices } from './admin_service'

// fetch student result per institute
const fetch_Student_Result_PerInstitute_byAdmin = catchAsync(
  async (req, res) => {
    const result =
      await AdminServices.report_student_result_per_institue_byAdmin_fromDB(
        req.params.instituteId as string,
        req.query
      )

    sendResponse(res, {
      status: 200,
      success: true,
      message: 'Student result fetched successfully',
      data: result.data,
      meta: result.meta
    })
  }
)

// fetct top courses per year byAdmin
const fetch_Top_Courses_perYear_byAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.report_top_courses_perYear_byAdmin_fromDB(
    req.query
  )
  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Top courses fetched successfully',
    data: result
  })
})

// fetch top ranking student by admin.
const fetch_topRanking_Student_byAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.report_Top_ranking_Student_byAdmin_fromDB(
    req.query
  )

  sendResponse(res, {
    status: 200,
    success: true,
    message: 'Top ranking student fetched successfully',
    data: result
  })
})

// seed insert million data
const seed_insert_million_data = catchAsync(async (req, res) => {
  const result =
    await AdminServices.insert_million_data_via_seed_function_intoDB(
      req.body.startNumber,
      req.body.endNumber
    )

  sendResponse(res, {
    status: 201,
    success: true,
    message: 'Data inserted successfully',
    data: result
  })
})

export const AdminControllers = {
  fetch_Student_Result_PerInstitute_byAdmin,
  fetch_Top_Courses_perYear_byAdmin,
  fetch_topRanking_Student_byAdmin,
  seed_insert_million_data
}
