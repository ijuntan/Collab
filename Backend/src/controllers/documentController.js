const { Document, Project } = require('../models')

module.exports = {
    async getDocument(documentId) {
        try {
            const document = await Document.findOne({_id : documentId})
            return document
        }
        catch(err) {
            return null
        }
    },

    async createDocument(req, res) {
        try {
            const document = await Document.create({...req.body})
            if(document) {
                await Project.findOneAndUpdate({_id : req.body.projectID}, {
                    $push:{
                        document: document._id
                    } 
                })
            res.status(200).send({msg: "document created"})
            }
        }
        catch(err) {
            console.log(err)
            res.status(404).send(err)
        }
    },

    async updateDocument(documentId, data) {
        try {
            await Document.findByIdAndUpdate(documentId, { data })
        }
        catch(err) {
            console.log(err)
            return err
        }
    },

    async deleteDocument(req, res) {
        try {
            const document = await Document.findOne({_id : req.params.id})
            if(document) {
                await Document.deleteOne({_id : req.params.id})
                await Project.findOneAndUpdate({_id : document.projectID}, {
                    $pull:{
                        document: req.params.id
                    } 
                })
                
                res.status(200).send({msg:"document deleted"})
            }
        }
        catch(err) {
            console.log(err)
            res.status(404).send({msg: "Please try again!"})
        }
    },

}