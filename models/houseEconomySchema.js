const { model, Schema } = require('mongoose')

const economySchema = new Schema({
    HouseID: {
        type: String,
        required: true
    },
    HouseBalance: {
        type: Number,
        required: true,
        default: 10000
    },
    HouseLord: {
        type: String,
        required: true,
    }
});

const HouseEconomy = model('HouseEconomy', economySchema)
module.exports = HouseEconomy;