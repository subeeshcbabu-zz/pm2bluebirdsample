'use strict';


var appServer = require('./appServer');

// appServer exports a function that returns a promise that starts the app server and
// will resolve to the server once app is started and ready to take traffic.
appServer().done();

