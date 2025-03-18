const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    title: String,
    date: Date,
    location: String,
    description: String,
    qrCode: String, 
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    guests: [{ name: String, email: String, status: {type: String, enum: ["pending", "accepteed", "declined"]}}]
});

module.exports = mongoose.model("Event", EventSchema);