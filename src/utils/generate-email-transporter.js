const nodemailer = require('nodemailer');

/**
 * @summary Mail transporter
 * @param {string} user
 * @param {string} pass
 * */
const generateEmailTransporter = (user, pass) =>
    nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user,
            pass
        },
    })

module.exports = generateEmailTransporter;
