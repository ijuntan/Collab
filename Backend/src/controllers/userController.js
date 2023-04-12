const jwt = require('jsonwebtoken');
const { User } = require('../models')
const config = require('../config/config');
const sendEmail = require('../services/sendEmail');

function jwtSignUser(user) {
    const ONE_WEEK = 7 * 24 * 60 * 60
    return jwt.sign(user, config.JwtSecret, {
        expiresIn: ONE_WEEK
    })
}

module.exports = {
    findByID: (req, res) => {
        const {user} = req;
        
        if(!user) {
            return res.status(400).send('Server is having issues, please try again!');
        }

        return res.json(user)
    },

    async signup(req, res) {
        try {
            const user = await User.create(req.body)
            const userObjJson = user.toJSON();

            return res.send({user: userObjJson, token: jwtSignUser(userObjJson)})

        } catch(error) {
            //console.log(error)
            if(Object.keys(error.keyValue[0] === 'username')){
                return res.status(400).send({error: 'This username exists'})
            }
            return res.status(400).send({error: 'Something is wrong'})
        }
    },

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({username})
            
            if(!user) {
                return res.status(400).send({error: "The login information is incorrect"})
            }
            
            const isPasswordValid = await user.verifyPassword(password)
            if(!isPasswordValid){
                return res.status(400).send({error: "The login information is incorrect"})
            }

            const userObjJson = user.toJSON();
            return res.send({
                user: userObjJson,
                token: jwtSignUser(userObjJson)
            })

        } catch(error) {
            return res.status(500).send({error: "Login function error"})
        }
    },

    async forgotpassword(req, res) {
        try {
            const { username } = req.body;
            const user = await User.findOne({username})
            console.log(username)
            if(!user) {
                return res.status(400).send({error: "No username found!"})
            }
            
            const resetToken = await user.getReset();
            await user.save();

            const resetUrl = `http://localhost:8080/resetpassword/${resetToken}`

            const message = `
                <h1> halo bry </h1>
                <a href = ${resetUrl} clicktracking = off> ${resetUrl} </a>
            `;
            
            try {
                await sendEmail({
                    to: user.username,
                    subject: "Password Reset Request",
                    text: message,
                })

                res.status(200).json({ success: true, data: "Email Sent" });
            }

            catch(err) {
                console.log(err);

                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;

                await user.save();

                return res.status(540).send({error: "Email could not be sent"})
            }

        } catch(err) {
            return res.status(500).send({error: "Forgot password error"})
        }
    },

    async resetpassword(req, res) {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

        try {
            const user = await User.findOne({
                resetPasswordToken,
                resetPasswordExpire: { $gt: Date.now() }
            })    

            if(!user) {
                return res.status(500).send({error: "Link Error"})
            }

            await user.updateOne()

            
        } catch(error) {
            return res.status(500).send({error: "Reset password error"})
        }
    }
}