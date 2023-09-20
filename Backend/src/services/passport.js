const passport = require('passport')
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt')
const{User} = require('../models')
require('dotenv').config();

passport.use(
    new JwtStrategy({
        jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken(), 
        secretOrKey: process.env.JWT_SECRET
    }, (async(jwtPayload, done) => {
        try{
            const user = await User.findById(jwtPayload._id)
            if(!user) {
                return done(new Error(), false)
            }
            return done(null, user)
        } catch(err) {

        }
        
    }))
)

module.exports = null