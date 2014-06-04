'use strict';

var User = require('../models').User;

module.exports = function (router) {

    /**
     * Index
     */
    router.get('/', function (req, res) {

        if (!req.session.user) {
            res.render('index', {
                error: req.flash('error'),
                success: req.flash('success'),
                email: req.flash('email')
            });
        } else {
            res.redirect('/home');
        }

    });

    /**
     * Login
     */
    router.post('/', function (req, res) {

        User.find({ where: { email: req.body.email } })
            .complete(function (err, user) {
                if (err) {
                    return console.log(err);
                }
                if (!user || !user.passwordMatches(req.body.password)) {
                    req.flash('error', 'Usuario y/o contraseña inválidos');
                    req.flash('email', req.body.email);
                    req.session.user = null;
                } else {
                    req.session.user = user;
                }
                res.redirect('/');
            });
    });

    /**
     * Logout
     */
    router.delete('/', function (req, res) {
        req.session.user = null;
        res.redirect('/');
    });

    /**
     * Sign up index
     */
    router.get('/signup', function (req, res) {

        res.render('signup');

    });

    router.post('/signup', function (req, res) {

        var user = User.build({
            email: req.body.email,
            password: req.body.password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            kind: req.body.kind
        });
        user.save().complete(function (err) {
            if (err) {
                return console.error(err);
            }
            req.flash('success', 'Bienvenido a Koulu!');
            res.redirect('/');
        });

    });

};