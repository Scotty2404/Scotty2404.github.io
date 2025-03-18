const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Registration
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword  = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.json({ message: "Registrierung war erfolgreich"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({error: "Benutzername nicht gefunden" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ error: "Falsches Passwort" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: "1h" });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

const authMiddleWare = (req, res, next) => {
    const token = req.header("Authoritation");
    if(!token){
        return res.status(401).json({ error: "Kein Token, Zugriff verweigert" });
    }
    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified.id;
        next();
    } catch (err) {
        res.status(400).json({ error: "Token ungültig" });
    }
};

module.exports = { router, authMiddleWare}