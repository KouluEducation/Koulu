'use strict';

var kraken = require('kraken-js'),
    app = require('express')(),
    options = require('./lib/spec')(app),
    flash = require('connect-flash'),
    moment = require('moment'),
    db = require('./models'),
    seeds = require('./seeds'),
    port = process.env.PORT || 8000;

app.use(kraken(options));
app.use(flash());

moment.lang('es');

db
    .sequelize
    .query('SET FOREIGN_KEY_CHECKS = 0')
    .then(function () {
        return db.sequelize.sync({ force: true });
    })
    .then(function () {
        return db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
    })
    .then(function () {
        return seeds.executeSeeds();
    })
    .then(function () {
        console.log('All seeds executed');
        app.listen(port, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
        });
    });
