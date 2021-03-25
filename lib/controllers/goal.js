const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Goal = require('../models/Goals');

module.exports = Router()
    .post('/', ensureAuth, (req, res, next) => {
        Goal
            .insert({ ...req.body, userId: req.user.id })
            .then(goal => res.send(goal))
            .catch(next);
    })

    .put('/:id', ensureAuth, (req, res, next) => {
        console.log(req.params.id)
        Goal
            .update(req.params.id, { ...req.body, userId: req.user.id })
            .then(goal => res.send(goal))
            .catch(next);

    })

    .get('/', (req, res, next) => {
        Goal
            .findAllPublicGoals()
            .then(goal => res.send(goal))
            .catch(next);
    })

    .get('/userGoal', ensureAuth, (req, res, next) => {
        Goal
            .find({ userId: req.user.id })
            .then(goal => res.send(goal))
            .catch(next);
    })

    .get('/:id', ensureAuth, (req, res, next) => {
        Goal
            .findOneGoal(req.params.id, req.user.id)
            .then(goal => res.send(goal))
            .catch(next);
    })

    .delete('/:id', ensureAuth, (req, res, next) => {
        Goal
            .delete(req.params.id, req.user.id);
    });