const { STACKHOLDER } = require("../enums")
const User = require("../models/user.model")

/**
 * Admin service
 * @class
 */
class AdminService {

    /**
     * make someone admin by another admin
     * @param {string} id 
     * @param {STACKHOLDER} role
     * @returns Promise<Document>
     */
    static changeRoleService = async (id, role) => {
        const user = await User.findByIdAndUpdate({ _id: id }, {
            role: role
        }, {
            new: true
        })

        return user
    }

}

module.exports = AdminService