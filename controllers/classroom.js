'use strict';

var UserSrv = require('../services/user'),
    models = require('../models'),
    Classroom = models.Classroom,
    Specialty = models.Specialty;

module.exports = function (router) {

    /**
     * Index
     */
    router.get('/new', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('back');
            }
            var data = {
                categories: [
                    {
                        key: 'primary',
                        name: 'Primaria'
                    },
                    {
                        key: 'secondary',
                        name: 'Secundaria'
                    }
                ]
            };
            Specialty.findAll().then(function (specialties) {
                data.specialties = specialties;
                res.render('classroom/form', data);
            });
        });
    });

    router.post('/', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req).then(function (user) {
            if (!user.isTeacher() && !user.isPreceptor()) {
                return res.redirect('/');
            }
            Classroom.build(req.body).save().complete(function (err, classroom) {
                if (err) {
                    return console.error(err);
                }
                res.redirect('back');
            });
        });
    });

};
