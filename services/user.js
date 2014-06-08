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
     * @returns {packet.user|*|connection.user|values.user|user|connectionConfig.user}
     * @param callback
     */
    getUser: function (request, callback) {
        User.find(request.session.user.id).complete(function (err, user) {
            if (err) return console.error(err);
            return callback(user);
        });
    },
    /**
     * Creates a user and it's specific kind
     * @param data
     * @param success Function
     * @param error Function
     */
    createUser: function (data, success, error) {
        User.build({
            email: data.email,
            password: data.password,
            first_name: data.first_name,
            last_name: data.last_name,
            kind: data.kind
        }).save().complete(function (err, user) {
            if (err) {
                error(err);
            }
            createUserKind(user, function (user) {
                success(user);
            });
        });
    }
};

/* ---- Private methods ---- */

/**
 * Creates user's specific kind
 * @param user
 * @param callback
 */
var createUserKind = function (user, callback) {
    if (user.isTeacher()) {
        Teacher.create({}).complete(function (err, teacher) {
            user.setTeacher(teacher).complete(function (err) {
                if (err) return console.error(err);
                return callback(user);
            });
        });
    } else if (user.isPreceptor()) {
        Preceptor.create({}).complete(function (err, preceptor) {
            user.setPreceptor(preceptor).complete(function (err) {
                if (err) return console.error(err);
                return callback(user);
            });
        });
    } else if (user.isParent()) {
        Parent.create({}).complete(function (err, parent) {
            user.setParent(parent).complete(function (err) {
                if (err) return console.error(err);
                return callback(user);
            });
        });
    } else if (user.isStudent()) {
        Student.create({}).complete(function (err, student) {
            user.setStudent(student).complete(function (err) {
                if (err) return console.error(err);
                return callback(user);
            });
        });
    }
};
