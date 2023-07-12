const { User, Conversation} = require('../models')
const config = require('../config/config');

const createConversation = async (body) => {
    try {
        const conv = await Conversation.create(body)
        if(conv) return conv
    }
    catch(error) {
        console.log(error)
    }
}

module.exports = {
    async getConversation(req, res) {
        try {
            const {id1, id2} = req.params
            const conv = await Conversation.findOne({participants: {$all: [id1, id2]}})
            res.status(200).json(conv)
        } catch(error) {
            console.log(error)
        }
    },
    async createMessage(req, res) {
        try {
            const {receiver, sender, message} = req.body
            const conv = await Conversation.findOne({participants: {$all: [receiver, sender]}})
            if(conv) {
                const done = await Conversation.findOneAndUpdate({participants: {$all: [receiver, sender]}}, {
                    $push:{
                        messages:{
                            sender: sender,
                            message: message,
                            time: new Date()
                        }
                    }
                })
                res.status(200).json(done)
            }
            else {
                const body = {
                    participants: [receiver, sender],
                    messages: [{
                        sender: sender,
                        message: message,
                        time: new Date()
                    }]
                }
                const done = await createConversation(body)
                res.status(200).json(done)
            }
        }   
        catch(error) {
            console.log(error)
        }
    }
}