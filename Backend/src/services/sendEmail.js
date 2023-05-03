const nodemailer = require('nodemailer')
const config = require('../config/config')
const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: config.email,
            pass: config.pass
        }
    })

    const mailOptions = {
        from: "juniortanaya@outlook.com",
        to: options.to,
        subject: options.subject,
        html: options.text
    }

    transporter.sendMail(mailOptions, function(err, info) {
        if(err) {
            console.log(err)
        } else {
            console.log(info)
        }
    })
}

module.exports = sendEmail