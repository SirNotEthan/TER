const { model, Schema } = require('mongoose')

const cooldownsSchema = new Schema({
    UserID: {
        type: String,
        required: true
    },
    Income: {
        type: Date,
        required: true
    }
});

const Cooldowns = model('Cooldowns', cooldownsSchema)
module.exports = Cooldowns;