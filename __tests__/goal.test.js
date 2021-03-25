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

    it('updates a goal vea PUT', async () => {


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

        const res1 = await agent
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

        const res = await agent
            .put(`/api/v1/goal/${res1.body.id}`)
            .send({
                title: 'mygoal',
                goalAmount: 70,
                currentAmount: 50,
                privatestate: false,
                completed: false,
                dateCreated: "date string",
                userId: user.id
            });


        await expect(res.body).toEqual({
            title: 'mygoal',
            goalAmount: 70,
            id: expect.any(String),
            currentAmount: 50,
            privatestate: false,
            completed: false,
            dateCreated: "date string",
            userId: user.id

        });

    });


    it('It gets all public goals vea get', async () => {
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

        await agent
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

        await agent
            .post('/api/v1/goal')
            .send({
                title: 'titse',
                goalAmount: 70,
                currentAmount: 50,
                privatestate: true,
                completed: true,
                dateCreated: "date string",
                userId: user.id
            });


        const res = await agent
            .get('/api/v1/goal')
            .then(res => {
                expect(res.body).toEqual([{
                    title: 'gole title',
                    goalAmount: 70,
                    id: expect.any(String),
                    currentAmount: 50,
                    privatestate: false,
                    completed: false,
                    dateCreated: "date string",
                    userId: user.id
                }])
            });
    });


    it(' all of the gouls for one user', async () => {
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

        await agent
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

        const res = await agent
            .get('/api/v1/goal/userGoal')
            .then(res => {
                expect(res.body).toEqual([{
                    title: 'gole title',
                    goalAmount: 70,
                    id: expect.any(String),
                    currentAmount: 50,
                    privatestate: false,
                    completed: false,
                    dateCreated: "date string",
                    userId: user.id
                }])
            });
    });

    it(' one goal for one user', async () => {
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

        const res1 = await agent
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

        const res = await agent
            .get(`/api/v1/goal/userGoal/${res1.body.id}`)
            .then(res => {
                expect(res.body).toEqual({
                    title: 'gole title',
                    goalAmount: 70,
                    id: expect.any(String),
                    currentAmount: 50,
                    privatestate: false,
                    completed: false,
                    dateCreated: "date string",
                    userId: user.id
                })
            });
    });
});