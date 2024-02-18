const { model, Schema } = require('mongoose')

const profileSchema = new Schema({
    UserID: {
        type: String,
        required: true,
    },
    Title: {
        type: String,
    },
    House: {
        type: String,
        default: 'Kingdom of Jerusalem',
    },
    Age: {
        type: Number,
        default: 0,
    },
});

const Profile = model('Profile', profileSchema)
module.exports = Profile;