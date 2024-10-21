const httpStatus = require("http-status");
const ApiError = require("../error/ApiError");
const { catchAsyncHandler } = require("../helper");
const { changeRoleService } = require("../services/admin.service");
const sendResponse = require("../utils/send-response");
const { ResponseStatus } = require("../enums");

/**
 * admin controller
 * @class
 */
class AdminController {

    static changeRole = catchAsyncHandler(async (req, res) => {

        const { id } = req.params

        const { role } = req.body
        
        const user = await changeRoleService(id, role)

        if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found!")
        
        sendResponse(res, {
            status: ResponseStatus.SUCCESS,
            statusCode: httpStatus.OK,
            message: "User role updated!",
            success: true,
            data: user
        })
        
    })
}

module.exports = AdminController