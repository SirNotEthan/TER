const { model, Schema } = require('mongoose')

const marketSchema = new Schema({
    OrderID: {
        type: String,
        required: true,
    },
    UserID: {
        type: String,
        required: true,
    },
    Order: {
        type: String,
        required: true,
    },
    PaymentType: {
        type: String,
        required: true,
    },
});

const Market = model('Market', marketSchema)
module.exports = Market;