const Mongoose = require("mongoose")

const userSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "Basic",
        required: true,
    },
});

const User = Mongoose.model('User', userSchema);

module.exports = User;