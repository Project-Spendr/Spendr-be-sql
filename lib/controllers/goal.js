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
        Goal
            .update(req.params.id, { ...req.body, userId: req.user.id });
    })

    .delete('/:id', ensureAuth, (req, res, next) => {
        Goal
            .delete(req.params.id, req.user.id);
    });