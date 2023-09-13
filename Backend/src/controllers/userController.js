const jwt = require('jsonwebtoken');
const { User, Notification } = require('../models')
const config = require('../config/config');
const sendEmail = require('../services/sendEmail');
const crypto = require('crypto')

function jwtSignUser(user) {
    const ONE_WEEK = 7 * 60 * 60 * 24 * 1000
    return jwt.sign(user, config.JwtSecret, {
        expiresIn: ONE_WEEK
    })
}

module.exports = {
    async followUser(req, res) {
        try {
            const {selfName, friendName} = req.body
            const self = await User.findOneAndUpdate({_id: selfName}, {$push: {follows: friendName}})
            await User.findOneAndUpdate({_id: friendName}, {$push: {followed: selfName}})
            await Notification.create({
                receiver: friendName,
                msg: `${self.username} follows you.`,
                isRead: false
            })

            res.status(200).send({msg: 'Success'})
        }
        catch(err) {
            return res.status(500).send({error: err.message})
        }
    },
    async unfollowUser(req, res) {
        try {
            const {selfName, friendName} = req.body
            const self = await User.findOneAndUpdate({_id: selfName}, {$pull: {follows: friendName}})
            const friend = await User.findOneAndUpdate({_id: friendName}, {$pull: {followed: selfName}})

            Promise.all([self, friend]).then(() => {
                return res.status(200).send({msg: 'Success'})
            })
        }
        catch(err) {
            return res.status(500).send({error: "Get Error"})
        }
    },
    async getUserByName(req, res) {
        try {
            const {name} = req.params
            const user = await User.findOne({username: name}).select("-password").populate("follows")

            return res.status(200).send(user)
        }
        catch(err) {
            return res.status(500).send({error: "Get Error"})
        }
    },

    async getUsersByName(req, res) {
        try {
            const {name} = req.params
            const users = await User.find({username: name}).select("-password")

            return res.status(200).send(users)
        }
        catch(err) {
            return res.status(500).send({error: "Get Error"})
        }
    },

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
            console.log(error)
            if(Object.keys(error.keyValue[0] === 'username' || error.keyValue[0] === 'email')){
                return res.status(400).send({error: 'This username or email exists'})
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
            
            const tempUser = await User.findOne({username}).select("-password")
            const userObjJson = tempUser.toJSON();

            return res.status(200).send({
                token: jwtSignUser(userObjJson)
            })

        } catch(error) {
            return res.status(500).send({error: "Login function error"})
        }
    },

    async forgotpassword(req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({email})

            if(!user) {
                return res.status(400).send({error: "No user with that email found!"})
            }
            
            const resetToken = await user.getReset();
            await user.save();

            const resetUrl = `http://localhost:3000/reset-password/${resetToken}`

            const message = `
                <h1> Here is the reset link to your account! Beware on sharing this link. </h1>
                <a href = ${resetUrl} clicktracking = off> Reset Password Link </a>
            `;
            
            try {
                await sendEmail({
                    to: user.email,
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

            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();

            return res.status(200).send({success: true, data: "Reset password success"})
            
        } catch(error) {
            return res.status(500).send({error: "Reset password error"})
        }
    },
}