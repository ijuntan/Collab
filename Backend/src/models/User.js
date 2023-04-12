const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true
})

UserSchema.pre("save", async function(next){
    try {
        if(!this.isModified('password')){
            return next()
        }
        const hashedPass = await bcrypt.hash(this.password, 8);
        return (this.password = hashedPass)
    } catch (error) {
        return next(error)
    }
})

UserSchema.pre('updateOne', async function(next){
    try {
        if(this._update.password){
            const hashedPass = await bcrypt.hash(this._update.password, 8)
            this._update.password = hashedPass
        }
        return next()
    } catch (error) {
        return next(error)
    }
})

UserSchema.methods.verifyPassword = async function(plain_password){
    return bcrypt.compare(plain_password, this.password)
}

UserSchema.methods.getReset = async function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token (private key) and save to database
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

    return resetToken
}

const User = mongoose.model('User', UserSchema)

module.exports = User