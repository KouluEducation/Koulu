'use strict';

var kraken = require('kraken-js'),
    app = require('express')(),
    options = require('./lib/spec')(app),
    db = require('./models'),
    port = process.env.PORT || 8000;

app.use(kraken(options));

db
    .sequelize
    .sync()
    .complete(function (err) {
        if (err) return console.error(err);
        app.listen(port, function (err) {
            if (err) return console.error(err);
            console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
        });
    });
