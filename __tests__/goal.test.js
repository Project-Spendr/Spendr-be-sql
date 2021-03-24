const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');


describe('videos routes', () => {
    beforeEach(() => {
        return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
    });

    it('creates a goal via POST', async () => {

        const agent = request.agent(app);
        const user = await UserService.create({
            email: 'test@test.com',
            username: 'ListeningStateChangedEvent',
            password: 'password'
        });
        console.log(agent)

        await agent
            .post('/api/v1/auth/login')
            .send({
                email: 'test@test.com',
                password: 'password',
                username: 'ListeningStateChangedEvent'
            });

        const res = await agent
            .post('/api/v1/goal')
            .send({
                title: 'gole title',
                goalAmount: 70,
                currentAmount: 50,
                privatestate: false,
                completed: false,
                dateCreated: "date string",
                userId: user.id
            });

        await expect(res.body).toEqual({
            title: 'gole title',
            goalAmount: 70,
            id: expect.any(String),
            currentAmount: 50,
            privatestate: false,
            completed: false,
            dateCreated: "date string",
            userId: user.id

        });
    });
});