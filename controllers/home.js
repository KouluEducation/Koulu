'use strict';

var models = require('../models'),
    User = models.User,
    Subject = models.Subject;

module.exports = function (router) {

    /**
     * Index
     */
    router.get('/', User.isAuthenticated(), User.inject(), function (req, res) {
        User.getCurrent(req).then(function (user) {
            if (user.isTeacher()) {
                user.getTeacher().then(function (teacher) {
                    return teacher.getClassroomsSubjects();
                }).then(function (classroomsSubjects) {
                    res.render('home_teacher', {
                        user: user,
                        classrooms: classroomsSubjects
                    });
                });
            } else if (user.isPreceptor()) {
                user.getPreceptor().then(function (preceptor) {
                    return preceptor.getClassrooms();
                }).then(function (classrooms) {
                    res.render('home_preceptor', {
                        user: user,
                        classrooms: classrooms
                    });
                });
            } else if (user.isStudent()) {
                var data = {};
                data.user = user;
                user.getStudent().then(function (student) {
                    data.student = student;
                    return student.getClassroom({ include: [ Subject ], order: 'name ASC' });
                }).then(function (classroom) {
                    data.classroom = classroom;
                    var start = new Date();
                    start.setMonth(2);
                    start.setDate(1);
                    var end = new Date();
                    end.setMonth(4);
                    end.setDate(31);
                    return data.student.getAverageQualification(start, end);
                }).then(function (first) {
                    data.first = first;
                    var start = new Date();
                    start.setMonth(5);
                    start.setDate(1);
                    var end = new Date();
                    end.setMonth(7);
                    end.setDate(31);
                    return data.student.getAverageQualification(start, end);
                }).then(function (second) {
                    data.second = second;
                    var start = new Date();
                    start.setMonth(8);
                    start.setDate(1);
                    var end = new Date();
                    end.setMonth(10);
                    end.setDate(30);
                    return data.student.getAverageQualification(start, end);
                }).then(function (third) {
                    data.third = third;
                    res.render("home_student", data);
                });
            } else {
                res.send('Ups! There is no home for your kind of user yet...');
            }
        });
    });

};