const {encrypt} = require("./encrypt-decrypt");


const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000)
    const encryptedOtp = encrypt(otp.toString())
    return {
        otp,
        encryptedOtp,
    }
}

module.exports = generateOTP



