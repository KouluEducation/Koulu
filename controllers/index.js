'use strict';

var db = require('../models');

module.exports = function (router) {

    /**
     * Index
     */
    router.get('/', function (req, res) {

        if (!req.session.activeUser) {
            res.render('index', {
                message: req.flash('error'),
                email: req.flash('email')
            });
        } else {
            res.json(req.session.activeUser);
        }

    });

    /**
     * Login
     */
    router.post('/', function (req, res) {

        db.User.find({ where: { email: req.body.email } })
            .complete(function (err, user) {
                if (err) return console.log(err);
                if (!user || !user.passwordMatches(req.body.password)) {
                    req.flash('error', 'Usuario y/o contraseña inválidos');
                    req.flash('email', req.body.email);
                    req.session.activeUser = null;
                } else {
                    req.session.activeUser = user;
                }
                res.redirect('/');
            });
    });

    /**
     * Logout
     */
    router.delete('/', function (req, res) {
        req.session.activeUser = null;
        res.redirect('/');
    });

    /**
     * Sign up
     */
    // TODO: should be post
    router.get('/signup', function (req, res) {

        var user = db.User.build({
            email: 'jc.ivancevich@gmail.com',
            password: 'koulu',
            first_name: 'Juan Carlos',
            last_name: 'Ivancevich'
        });
        user.save().complete(function (err) {
            if (err) return console.error(err);
        });

    });

};