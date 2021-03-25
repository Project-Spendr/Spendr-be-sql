const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('demo routes', () => {
    beforeEach(() => {
        return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    });

    it('allows a user to signup via POST', async () => {
        return request(app)
            .post('/api/v1/auth/signup')
            .send({ email: 'test@test.com', username: 'ListeningStateChangedEvent', password: 'password' })
            .then(res => {
                expect(res.body).toEqual({
                    id: expect.any(String),
                    username: 'ListeningStateChangedEvent',
                    email: 'test@test.com'
                });
            });
    });

    it('allows a user to login via POST', async () => {
        const user = await UserService.create({
            email: 'test2@test.com',
            username: 'ListeningStateChangedEvent',
            password: 'password'
        });


        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'test2@test.com',
                password: 'password'
            }).then(res => {
                expect(res.body).toEqual({
                    id: expect.any(String),
                    email: 'test2@test.com',
                    username: 'ListeningStateChangedEvent'
                });
            });
    })

    it('verifies a user is logged in', async () => {
        const agent = request.agent(app);
        const user = await UserService.create({
            email: 'test@test.com',
            username: 'ListeningStateChangedEvent',
            password: 'password'
        });
        await agent
            .post('/api/v1/auth/login')
            .send({
                email: 'test@test.com',
                password: 'password',
                username: 'ListeningStateChangedEvent'
            });

        const res = await agent
            .get('/api/v1/auth/verify');

        expect(res.body).toEqual({
            id: user.id,
            email: 'test@test.com',
            username: 'ListeningStateChangedEvent'
        });
    });
});