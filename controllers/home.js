var UserSrv = require('../services/user');

module.exports = function (router) {

    /**
     * Index
     */
    router.get('/', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req, function (user) {
            if (user.isTeacher()) {
                user.getTeacher().complete(function (err, teacher) {
                    teacher.getClassrooms().complete(function (err, classrooms) {
                        res.render('home', {
                            user: user,
                            classrooms: classrooms
                        });
                    });
                });
            } else {
                res.render('home', {
                    user: user
                });
            }
        });
    });

    router.get('/classrooms.json', UserSrv.isAuthenticated(), UserSrv.injectUser(), function (req, res) {
        UserSrv.getUser(req, function (user) {
            if (user.isTeacher()) {
                user.getTeacher().complete(function (err, teacher) {
                    teacher.getClassrooms().complete(function (err, classrooms) {
                        res.json(classrooms);
                    });
                });
            } else {
                res.json([]);
            }
        });
    });

};
