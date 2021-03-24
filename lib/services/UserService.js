
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = class UserService {
    static async create({ email, password, username }) {
        const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
        const user = await User.insert({ email, username, passwordHash });
        return user;
    }

    static async authorize({ email, password }) {
        try {
            console.log(password)
            const user = await User.findByEmail(email)
            const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
            if (!passwordsMatch) throw new Error('Invalid Password');

            return user;
        } catch (err) {
            err.status = 401;
            throw err;
        }
    }

    static authToken(user) {
        return jwt.sign({ user: user.toJSON() }, process.env.APP_SECRET, {
            expiresIn: '24h'
        });
    }

    static verifyAuthToken(token) {
        const { user } = jwt.verify(token, process.env.APP_SECRET);
        return user;
    }
};