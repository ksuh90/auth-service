const bcrypt = require('bcryptjs');
const db = require('../db');

const controller = async function(req, res, next) {
    try {
        const user = req.params.user;
        const pass = req.params.password;

        if (!user || !pass) {
            res.send(400, { msg: 'Please provide username and password.' });
        } else if (await db.getAsync(`user:${user}`)) {
            res.send(409, { msg: 'That username is already registered.' });
        } else {
            const hash = bcrypt.hashSync(pass);
            const ok = await db.setAsync(`user:${user}`, hash);

            if (ok) {
                res.send(201, { msg: 'User registered.' });
            } else {
                throw new Error();
            }
        }
    } catch(err) {
        res.send(500, { msg: 'Internal error.' });
    }

    return next();
};

const route = function(server) {
    server.post('/register', controller);
};

module.exports = route;
