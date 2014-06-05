var models = require('../models'),
    Teacher = models.Teacher,
    Parent = models.Parent,
    Preceptor = models.Preceptor,
    Student = models.Student;

module.exports = {
    /**
     * Creates user's specific kind
     * @param user
     * @param callback
     */
    createUserKind: function (user, callback) {
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
    }
};