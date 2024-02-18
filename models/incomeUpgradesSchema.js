const { model, Schema } = require('mongoose')

const incomeUpgrades = new Schema({
    UserID: {
        type: String,
        required: true,
    },
    UpgradeOne: {
        type: Number,
        required: true,
    },
    UpgradeTwo: {
        type: Number,
        required: true,
    },
    UpgradeThree: {
        type: Number,
        required: true,
    }
})

const IncomeUpgrades = model('IncomeUpgrades', incomeUpgrades)
module.exports = IncomeUpgrades