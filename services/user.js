'use strict';

var q = require('q'),
    models = require('../models'),
    User = models.User,
    Teacher = models.Teacher,
    Parent = models.Parent,
    Preceptor = models.Preceptor,
    Student = models.Student;

module.exports = {
    /**
     * Redirects if there is no user logged in
     * @returns {Function}
     */
    isAuthenticated: function () {
        return function (req, res, next) {
            if (req.session.user) {
                next();
            } else {
                res.redirect('/');
            }
        };
    },
    /**
     * A helper method to add the user to the response context so we don't have to manually do it.
     * @returns {injectUser}
     */
    injectUser: function () {
        return function injectUser (req, res, next) {
            res.locals.user = req.session.user;
            next();
        };
    },
    /**
     * Return logged in user
     * @param request
     * @returns promise
     */
    getUser: function (request) {
        var deferred = q.defer();

        User.find(request.session.user.id).complete(function (err, user) {
            if (err) {
                return deferred.reject(err);
            }
            deferred.resolve(user);
        });

        return deferred.promise;
    },
    /**
     * Creates a user and it's specific kind
     * @param data
     */
    createUser: function (data) {
        var deferred = q.defer();

        User.build({
            email: data.email,
            password: data.password,
            first_name: data.first_name,
            last_name: data.last_name,
            kind: data.kind
        }).save().complete(function (err, user) {
            if (err) {
                deferred.reject(err);
            }
            createUserKind(user).then(function (user) {
                deferred.resolve(user);
            });
        });

        return deferred.promise;
    }
};

/* ---- Private methods ---- */

/**
 * Creates user's specific kind
 * @param user
 */
var createUserKind = function (user) {
    var deferred = q.defer();

    if (user.isTeacher()) {
        Teacher.create({}).complete(function (err, teacher) {
            user.setTeacher(teacher).complete(function (err) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(user);
            });
        });
    } else if (user.isPreceptor()) {
        Preceptor.create({}).complete(function (err, preceptor) {
            user.setPreceptor(preceptor).complete(function (err) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(user);
            });
        });
    } else if (user.isParent()) {
        Parent.create({}).complete(function (err, parent) {
            user.setParent(parent).complete(function (err) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(user);
            });
        });
    } else if (user.isStudent()) {
        Student.create({}).complete(function (err, student) {
            user.setStudent(student).complete(function (err) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(user);
            });
        });
    }

    return deferred.promise;
};
