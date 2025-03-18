const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const QRCode = require('qrcode');
const { authMiddleWare } = require('./authRoutes')

//create Event
router.post('/create', authMiddleWare, async(req, res) => {
    try {
        const { title, date, location, description } = req.body;
        const newEvent = new Event({title, date, location, description, owner: req.user, guests: [] });

        const qrData = `https://EventPlannerFrontend/event/${newEvent._id}`;
        newEvent.save();

        //Add Event to User-Events Array
        await User.findByIdAndUpdate(req.user, { $push: {events: newEvent._id} });
        res.json(newEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//get All Events for loggedIn User
router.get('/my-events', authMiddleWare, async (req, res) => {
    const events = await Event.find({ owner: req.user });
    res.json(events);
});

//Guest Answer
router.post('/respond/:eventId', async (req, res) => {
    try {
        const { name, email, status } = req.body;
        const event = await Event.findById(req.params.eventId);
        if(!event) {
            return res.status(404).json({ error: "Event nicht gefunden" });
        }

        const guestIndex = event.guests.findIndex(g => g.email === email);
        if(guestIndex !== -1){
            event.guest[guestIndex].status = status;
        } else {
            event.guests,push({ name, email, status });
        }

        await event.save();
        res.json({ message: "Antwort gespeichert", event });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Get guests for specific Event
router.get('/:eventId/guests', authMiddleWare, async (req, res) => {
    const event = await Event.findById(req.params.eventId);
    if(!event || event.owner.toString() !== req.user) {
        return res.status(403).json({ error: "Zugriff verweigert" });
    }

    res.json(event.guests);
});
module.exports = router;