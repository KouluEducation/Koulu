'use strict';

var models = require('../models'),
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
        return User.find(request.session.user.id);
    },
    /**
     * Creates a user and it's specific kind
     * @param data
     */
    createUser: function (data) {
        return User.build({
            email: data.email,
            password: data.password,
            first_name: data.first_name,
            last_name: data.last_name,
            kind: data.kind
        }).save().then(function (user) {
            return createUserKind(user);
        });
    }
};

/* ---- Private methods ---- */

/**
 * Creates user's specific kind
 * @param user
 */
var createUserKind = function (user) {
    if (user.isTeacher()) {
        return Teacher.create({}).then(function (teacher) {
            return user.setTeacher(teacher);
        });
    } else if (user.isPreceptor()) {
        return Preceptor.create({}).then(function (preceptor) {
            return user.setPreceptor(preceptor);
        });
    } else if (user.isParent()) {
        return Parent.create({}).then(function (parent) {
            return user.setParent(parent);
        });
    } else if (user.isStudent()) {
        return Student.create({}).then(function (student) {
            return user.setStudent(student);
        });
    }
};
