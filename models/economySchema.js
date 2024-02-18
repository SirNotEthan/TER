const { model, Schema } = require('mongoose')

const economySchema = new Schema({
    UserID: {
        type: String,
        required: true
    },
    Balance: {
        type: Number,
        required: true,
        default: 1000
    },
});

const Economy = model('Economy', economySchema)
module.exports = Economy;