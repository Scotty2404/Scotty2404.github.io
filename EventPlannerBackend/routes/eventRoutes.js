const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto'); // For generating secure tokens
const jwt = require('jsonwebtoken'); // For JWT tokens
const { authMiddleware } = require('./authRoutes');

// Ensure the QR code directory exists
const qrCodeDir = path.join(__dirname, '../public/qr-codes');
if (!fs.existsSync(qrCodeDir)) {
    fs.mkdirSync(qrCodeDir, { recursive: true });
}

// Function to generate a secure access token for an event
function generateEventAccessToken(eventId, userId) {
    return jwt.sign(
        { 
            eventId, 
            createdBy: userId,
            createdAt: Date.now(),
            type: 'event-access'
        }, 
        process.env.JWT_SECRET
    );
}

// Create an event with venue
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { 
            title, 
            description, 
            venue,
            playlist_id, 
            startdate, 
            enddate, 
            max_guests,
            survey_id
        } = req.body;
        
        const userId = req.user;

        // First, create the venue if provided
        let venueId = null;
        if (venue) {
            const { street, city, postal_code, google_maps_link } = venue;
            
            // Insert the venue into the database
            db.query(
                'INSERT INTO event_management.venue (street, city, postal_code, google_maps_link) VALUES (?, ?, ?, ?)',
                [street, city, postal_code, google_maps_link],
                (err, venueResult) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    
                    venueId = venueResult.insertId;
                    // Continue with event creation using the new venue_id
                    createEventWithVenue(venueId);
                }
            );
        } else if (req.body.venue_id) {
            // If venue_id is provided instead of venue object, use it directly
            venueId = req.body.venue_id;
            createEventWithVenue(venueId);
        } else {
            return res.status(400).json({ error: "Either venue object or venue_id must be provided" });
        }
        
        // Function to create event once we have the venue ID
        function createEventWithVenue(venueId) {
            // Insert event into the database first to get the event ID
            db.query(
                'INSERT INTO event_management.event (title, description, venue_id, playlist_id, startdate, enddate, max_guests, active, survey_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [title, description, venueId, playlist_id, startdate, enddate, max_guests, 1, survey_id],
                async (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    const eventId = result.insertId;
                    
                    // Generate secure access token for the event
                    const accessToken = generateEventAccessToken(eventId, userId);
                    
                    // Store access token in the database - can be a new field in the event table or a separate table
                    db.query(
                        'UPDATE event_management.event SET access_token = ? WHERE event_id = ?',
                        [accessToken, eventId],
                        (tokenErr) => {
                            if (tokenErr) {
                                console.error("Error saving access token:", tokenErr);
                            }
                        }
                    );
                    
                    // Generate QR Code with event ID and access token
                    try {
                        // The URL now includes the access token
                        const qrData = `https://EventPlannerFrontend/event/${eventId}?token=${accessToken}`;
                        const qrFileName = `event-${eventId}-${Date.now()}.png`;
                        const qrFilePath = path.join(qrCodeDir, qrFileName);
                        const qrRelativePath = `/qr-codes/${qrFileName}`;
                        
                        // Generate QR code and save to file
                        await QRCode.toFile(qrFilePath, qrData);
                        
                        // Insert QR Code info into the database - now including the access token
                        db.query(
                            'INSERT INTO event_management.qr_code (url, access_token, qr_image) VALUES (?, ?, ?)',
                            [qrData, accessToken, qrRelativePath],
                            (qrErr, qrResult) => {
                                if (qrErr) {
                                    console.error("Error saving QR code to database:", qrErr);
                                } else {
                                    // Update event with QR code ID
                                    db.query(
                                        'UPDATE event_management.event SET qr_id = ? WHERE event_id = ?',
                                        [qrResult.insertId, eventId],
                                        (updateErr) => {
                                            if (updateErr) {
                                                console.error("Error updating event with QR code ID:", updateErr);
                                            }
                                        }
                                    );
                                }
                            }
                        );
                        
                        // Create relationship between user and event (organizer)
                        db.query(
                            'INSERT INTO event_management.user_event (user_id, event_id, confirmation, owner) VALUES (?, ?, ?, ?)',
                            [userId, eventId, 1, 1],
                            (userEventErr) => {
                                if (userEventErr) {
                                    console.error("Error creating user-event relationship:", userEventErr);
                                }
                            }
                        );

                        // Return new event with all details
                        db.query(`
                            SELECT e.*, v.street, v.city, v.postal_code, v.google_maps_link, 
                                   qr.url as qr_url, qr.qr_image, qr.access_token
                            FROM event_management.event e
                            LEFT JOIN event_management.venue v ON e.venue_id = v.venue_id
                            LEFT JOIN event_management.qr_code qr ON e.qr_id = qr.qr_id
                            WHERE e.event_id = ?
                        `, [eventId], (err, events) => {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }
                            res.json(events[0]);
                        });
                    } catch (qrErr) {
                        console.error("Error generating QR code file:", qrErr);
                        
                        // Even if QR code generation fails, return the created event
                        db.query(`
                            SELECT e.*, v.street, v.city, v.postal_code, v.google_maps_link, e.access_token
                            FROM event_management.event e
                            LEFT JOIN event_management.venue v ON e.venue_id = v.venue_id
                            WHERE e.event_id = ?
                        `, [eventId], (err, events) => {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }
                            res.status(201).json({
                                ...events[0],
                                warning: "QR code generation failed"
                            });
                        });
                    }
                }
            );
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all owned events for logged in user
router.get('/my-events', authMiddleware, (req, res) => {
    const userId = req.user;
    
    // Query events where the user is the owner
    db.query(`
        SELECT e.*, v.street, v.city, v.postal_code
        FROM event_management.event e
        JOIN event_management.user_event ue ON e.event_id = ue.event_id
        LEFT JOIN event_management.venue v ON e.venue_id = v.venue_id
        WHERE ue.user_id = ? AND ue.owner = 1
        ORDER BY e.startdate DESC
    `, [userId], (err, events) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(events);
    });
});

// event information after scanning qr (link + token) // !! Venue not in !!
router.get('/public-event/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { token } = req.query;
        
        if (!token) {
            return res.status(401).json({ error: "Access token required" });
        }
        
        // Check if the event exists with this token
        // Properly join the tables using qr_id
        db.query(
            `SELECT e.event_id, e.title, e.startdate, e.enddate, e.description, e.access_token, q.access_token as qr_access_token
             FROM event e
             LEFT JOIN qr_code q ON e.qr_id = q.qr_id
             WHERE e.event_id = ? AND (e.access_token = ? OR q.access_token = ?)`,
            [eventId, token, token],
            (err, events) => {
                if (err) {
                    console.error("Database error:", err);
                    return res.status(500).json({ error: err.message });
                }
                
                if (events.length === 0) {
                    return res.status(403).json({ error: "Invalid event or access token" });
                }
                
                const event = events[0];
                
                res.json({
                    id: event.event_id,
                    title: event.title, 
                    startdate: event.startdate,
                    enddate: event.enddate,
                    description: event.description
                });
            }
        );
    } catch (err) {
        console.error("Route error:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;