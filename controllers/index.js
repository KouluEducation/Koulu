'use strict';

var db = require('../models');

module.exports = function (router) {

    router.get('/', function (req, res) {

        db.User.find(1).success(function (user) {
            if (!user) return res.send('No Users');
            res.send(user.getNameUpperCase());
        });

    });

};
