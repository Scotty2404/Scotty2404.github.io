const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

// test data for an event
const testEvent = {
    title: 'Test Event',
    description: 'Description for test-event',
    venue: JSON.stringify({
        street: 'Teststr. 1',
        city: 'Testcity',
        postal_code: '12345',
        google_maps_link: 'https://maps.google.com'
    }),
    playlist_id: null,
    startdate: '2025-05-01 10:00:00',
    enddate: '2025-05-01 15:00:00',
    max_guests: 10,
    survey_id: null
};

describe('EventRoutes tests', () => {
    let token; //save token for futher tests

    const testUser = {
        firstname: 'Max',
        lastname: 'Mustermann',
        email: 'max.mustermann@beispiel.de',
        password: 'Test1234!'
    };

    beforeAll(async () => {

        await request(app)
            .post('/api/auth/register')
            .send(testUser);

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: testUser.password });

        token = loginRes.body.token;
    });

    // Test creation of new event
    it('should create new event', async () => {
        const res = await request(app)
            .post('/api/events/create')
            .set('Authorization', `Bearer ${token}`)
            .send(testEvent);
        //console.log(res.body);
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('event_id');
        expect(res.body.title).toBe(testEvent.title);
        expect(res.body.description).toBe(testEvent.description);
        expect(res.body).toHaveProperty('qr_url');
    });

    // Test missing authorization for event-creation
    it('should return 401 for /create', async () => {
        const res = await request(app)
            .post('/api/events/create')
            .send(testEvent);
        
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('Kein Token, Zugriff verweigert');
    });

    // test for incomplete event data when creating (missing venue)
    it('should return 400 if event is incomplete', async () => {
        const incompleteEvent = { ...testEvent };
        delete incompleteEvent.venue;

        const res = await request(app)
            .post('/api/events/create')
            .set('Authorization', `Bearer ${token}`)
            .send(incompleteEvent);

        expect(res.statusCode).toBe(400);
    });


    // test get all owned events fpr logged in user
    it('should return all owned events of logged-in user', async () => {
        const res = await request(app)
            .get('/api/events/my-events')
            .set('Authorization', `Bearer ${token}`);
        //console.log(res.body);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('title', testEvent.title);
        expect(res.body[0]).toHaveProperty('description', testEvent.description);
    });

    // test get all owned events for logged in user without token
    it('should return 401 for /my-events', async () => {
        const res = await request(app)
            .get('/api/events/my-events');
        //console.log(res.body);

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('Kein Token, Zugriff verweigert');
    });

    // test get all owned events for wrong or nonexisting user
    it('should return 403 for /my-events', async () => {
        const invalidToken = 'invalid.token';
        const res = await request(app)
            .get('/api/events/my-events')
            .set('Authorization', `Bearer ${invalidToken}`);
        //console.log(res.body);

        expect(res.statusCode).toBe(400);
    });

    afterAll(async () => {
        await new Promise((resolve, reject) => {
            global.db.query(
                'DELETE FROM event_management.event WHERE title = ?'
                , [testEvent.title], (err) => {
                    if(err) reject(err);
                    resolve();
                });
        });
        await new Promise((resolve, reject) => {
            global.db.query(
                'DELETE FROM event_management.user WHERE email = ?'
                , [testUser.email], (err) => {
                    if (err) reject(err);
                    resolve();
            });
        });

        await new Promise((resolve, reject) => {
            global.db.end((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
 
})