'use strict';


var express = require('express');
var kraken = require('kraken-js');
var pkg = require('./package.json');
var Bluebird = require('bluebird');

//
module.exports = function startApp(configOverride) {
    return new Bluebird(function (resolve, reject) {
        var options = {

            onconfig: function kraken_options_onconfig(config, next) {
                if (typeof configOverride === 'function') {
                    configOverride(config);
                }
                next(null, config);
            }

        };
        var app = express();
        app.use(kraken(options));

        function onAppError(err) {
            console.log('Application error:', err.stack);
            reject(err);
        }

        app.on('error', onAppError);

        app.once('start', function () {
            app.removeListener('error', onAppError);
            resolve(app);
        });

        app.once('shutdown', function () {
            console.log('Application shutting down.');
        });

        return app;
    });
};
