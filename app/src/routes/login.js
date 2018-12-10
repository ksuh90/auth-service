const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const controller = async function(req, res, next) {
    const user = req.params.user;
    const pass = req.params.password;
    const passHash = await db.getAsync(`user:${user}`);
    if (passHash && bcrypt.compareSync(pass, passHash)) {
        const token = jwt.sign(
            { username: user },
            process.env.SECRET,
            { expiresIn: '2m' } // 2 mins
        );
        res.send(200, { msg: 'Login successful', jwt: token });
    } else {
        res.send(401, { msg: 'You shall not pass' });
    }
    return next();
};

const route = function(server) {
    server.post('/login', controller);
};

module.exports = route;
