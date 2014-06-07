'use strict';

var models = require('../models'),
    UserSrv = require('../services/user'),
    User = models.User,
    Teacher = models.Teacher;

var flushFlash = function (request) {
    request.flash('error', null);
    request.flash('success', null);
    request.flash('values', null);
};

module.exports = function (router) {

    /**
     * Index
     */
    router.get('/', function (req, res) {

        if (!req.session.user) {
            res.render('index', {
                error: req.flash('error'),
                success: req.flash('success'),
                values: req.flash('values')[0]
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
                    req.flash('error', 'Error al ingresar');
                    return res.redirect('back');
                }
                if (!user || !user.passwordMatches(req.body.password)) {
                    req.flash('error', 'Usuario y/o contraseña inválidos');
                    req.flash('values', req.body);
                    req.session.user = null;
                } else {
                    flushFlash(req);
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
        flushFlash(req);
        res.redirect('/');

    });

    /**
     * Sign up index
     */
    router.get('/signup', function (req, res) {

        res.render('signup', {
            error: req.flash('error'),
            values: req.flash('values')[0]
        });

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
                req.flash('error', 'Error al crear usuario');
                req.flash('values', req.body);
                return res.redirect('back');
            }
            UserSrv.createUserKind(user, function (user) {
                req.flash('success', 'Bienvenido a Koulu!');
                res.redirect('/');
            });
        });

    });

};