const nodemailer = require('nodemailer')

const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'juniortanaya@outlook.com',
            pass: 'valhalla1099'
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