const nodemailer = require('nodemailer')

const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS
        }
    })

    const mailOptions = {
        from: process.env.EMAIL,
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