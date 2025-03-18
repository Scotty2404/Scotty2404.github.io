const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {tape: Strinf, require: true, unique: true},
    email: {tape: String, reauired: true, unique: true},
    password: {tape: String, required: true},
    events: [{tape: mongoose.Schema.Types-isObjectIdOrHexString, ref: "Event" }]
});

module.exports = mongoose.model("User", UserSchema);