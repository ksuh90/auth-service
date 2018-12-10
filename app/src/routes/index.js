module.exports = function(server) {
    server.get('/', function(req, res, next){
        res.send({
            name: 'Auth service',
            tagline: 'hello world!'
        });
        return next();
    });

    require('./register')(server);
    require('./login')(server);
};
