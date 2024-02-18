const { model, Schema } = require('mongoose')

const aosSchema = new Schema({
    ID: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        required: true
    },
    Reason: {
        type: String,
        required: true
    },
    Severity: {
        type: Number,
        required: true
    }
});

const AOS = model('AOS', aosSchema)
module.exports = AOS;