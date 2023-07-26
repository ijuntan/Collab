const passport = require('passport')
const Joi = require('joi')

module.exports = {
    isAuthenticated: (req, res, next) => {
        passport.authenticate('jwt', (err, user) => {
            if(err || !user) {
                //localStorage.removeItem('token')
                res.status(403).send({
                    error: 'No pass'
                })
            }
            else {
                req.user = user
                next();
            }
        })(req, res, next);
    },
    signup: (req, res, next) => {
        const Schema = Joi.object({
            username: Joi.string(),
            email: Joi.string().email({minDomainSegments:2}),
            password: Joi.string().regex(
                new RegExp("^[a-zA-Z0-9]{8,32}$")
            )
        })
        
        const {error} = Schema.validate(req.body)
        if(error){
            switch(error.details[0].context.key){
                case 'username':
                    res.status(400).send({error: "Invalid username"})
                    break;
                case 'email':
                    res.status(400).send({error: "Invalid email"})
                    break;
                case 'password':
                    res.status(400).send({error: "Invalid password"})
                    break;
                default:
                    res.status(400).send({error: "Invalid sign up"})
                    break;
            }
        }
        else {
            next()
        }
    }
}