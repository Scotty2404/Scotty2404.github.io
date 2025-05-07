const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, reauired: true, unique: true},
    password: {type: String, required: true},
    events: [{type: mongoose.Schema.Types.ObjectId, ref: "Event" }]
});

module.exports = mongoose.model("User", UserSchema);