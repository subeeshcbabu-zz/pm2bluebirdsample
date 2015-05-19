'use strict';

var startApp = require('./app');
var pkg = require('./package.json');
var http = require('http');
var Bluebird = require('bluebird');


function startServer(app) {
    return new Bluebird(function (resolve, reject) {
        var server = http.createServer(app);
        server.listen(8000);

        function onError(err) {
            console.error('Start server error: ', err.stack);
            reject(err);
            process.exit(1);
        }

        server.once('error', onError);

        server.once('listening', function () {
            server.removeListener('error', onError);
            console.log('Server listening on port ', this.address().port);
            resolve(this);
        });
    });
}

//
module.exports = function startAppServer(configOverride) {
    function starting(req, res) {
        var msg = 'server starting';
        res.writeHead(503, {
            'Content-Type': 'text/plain',
            'Content-Length': msg.length,
            'X-RETRY': 'error-code=server starting'
        });
        res.write(msg);
        res.end();
    }

    return Bluebird.join(
        startApp(configOverride),
        startServer(starting)
    )
        .spread(function (app, server) {
            server.removeListener('request', starting);
            server.on('request', app);
            return server;
        });
};
