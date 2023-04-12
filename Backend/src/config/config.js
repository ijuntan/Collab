module.exports = {
    db: {
        mongoURI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/node-auth'
    },
    JwtSecret: process.env.JWT_SECRET || "super_secret"
}