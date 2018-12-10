const restify = require('restify');
require('dotenv').config();

// Instantiate server
const server = restify.createServer();
server.use(restify.plugins.bodyParser({ mapParams: true }));

require('./routes')(server);

if (!module.parent){
    server.listen(process.env.PORT, function() {
        console.log('%s listening at %s', server.name, server.url);
    });
}

module.exports = server;
