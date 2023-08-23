const mongoose = require('mongoose')

const { Schema, Types } = mongoose;

const DocumentSchema = new Schema({
    title: String,
    data: Object,
        
    projectID: {
        type: Types.ObjectId,
        ref: "Project",
        required: true,
    },
})

const Document = mongoose.model('Document', DocumentSchema)

module.exports = Document