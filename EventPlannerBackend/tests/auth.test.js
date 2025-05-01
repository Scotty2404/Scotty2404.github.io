const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

describe('AuthRoutes tests', () => {
    let token; //save token for tests
    let userId; //save user_id for tests

    const testUser = {
        firstname: 'Max',
        lastname: 'Mustermann',
        email: 'max.mustermann@example.com',
        password: 'Test1234!'
    };

    const newPassword = 'Neu1234!';

    //test registration route
    it('should register new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);
        //console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('user_id');
        
        userId = res.body.user_id; //set userId for follow up tests
    });

    //test login route
    it('should login testuser', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: testUser.email, password: testUser.password });
        //console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');

        token = res.body.token; //set token for follow up tests
    });

    it('sould get user info', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('email', testUser.email);
    });

    it('should change user password', async () => {
        const res = await request(app)
            .post('/api/auth/change-password')
            .set('Authorization', `Bearer ${token}`)
            .send({
                currentPassword: testUser.password,
                newPassword: newPassword
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Passwort erfolgreich geändert");
    });

    //reset state of database
    afterAll(async () => {
        await new Promise((resolve, reject) => {
            global.db.query('DELETE FROM event_management.user WHERE email = ?', [testUser.email], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
});