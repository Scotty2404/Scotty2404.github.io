const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Auth Middleware (must be defined before routes that use it)
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ error: "Kein Token, Zugriff verweigert" });
    }
    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified.id;
        console.log('user id :', verified.id);
        next();
    } catch (err) {
        res.status(400).json({ error: "Token ungültig" });
    }
};

// Registration
router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        
        // Validation of input data
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ error: "Alle Felder müssen ausgefüllt sein" });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Check if user already exists
        db.query('SELECT * FROM event_management.user WHERE email = ?', [email], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: "E-Mail existiert bereits" });
            }

            // Insert new user
            db.query(
                'INSERT INTO event_management.user (firstname, lastname, email, password) VALUES (?, ?, ?, ?)',
                [firstname, lastname, email, hashedPassword],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ 
                        message: "Registrierung war erfolgreich",
                        user_id: result.insertId 
                    });
                }
            );
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // find user
        db.query('SELECT * FROM event_management.user WHERE email = ?', [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (results.length === 0) {
                return res.status(400).json({ error: "Benutzer nicht gefunden" });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                return res.status(400).json({ error: "Falsches Passwort" });
            }

            // Generate token
            const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            
            // Remove password from response
            const { password: _, ...userWithoutPassword } = user;
            
            res.json({ token, user: userWithoutPassword });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user information
router.get('/me', authMiddleware, (req, res) => {
    db.query('SELECT user_id, firstname, lastname, email FROM event_management.user WHERE user_id = ?', 
    [req.user], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Benutzer nicht gefunden" });
        }
        res.json(results[0]);
    });
});

// change password
router.post('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Retrieve current user and password
        db.query('SELECT * FROM event_management.user WHERE user_id = ?', [req.user], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            const user = results[0];
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            
            if (!isMatch) {
                return res.status(400).json({ error: "Aktuelles Passwort ist falsch" });
            }
            
            // Hash and update new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            db.query('UPDATE event_management.user SET password = ? WHERE user_id = ?', 
            [hashedPassword, req.user], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: "Passwort erfolgreich geändert" });
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export router and authMiddleware
module.exports = { router, authMiddleware };