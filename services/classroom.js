var models = require('../models'),
    Classroom = models.Classroom,
    User = models.User,
    Teacher = models.Teacher,
    Parent = models.Parent,
    Preceptor = models.Preceptor,
    Student = models.Student;

module.exports = {
    /**
     * Creates a classroom and associates it with its creator
     * @param data
     * @param user
     * @param success Function
     * @param error Function
     */
    createClassroom: function (data, user, success, error) {
        Classroom.build({
            name: data.name,
            category: data.category
        }).save().complete(function (err, classroom) {
            if (err) {
                error(err);
            }
            associateUser(classroom, user, function (classroom) {
                success(classroom);
            });
        });
    }
};

/* ---- Private methods ---- */

/**
 * Associates logged in user with a classroom
 * @param classroom
 * @param user
 * @param callback
 */
var associateUser = function (classroom, user, callback) {
    if (user.isTeacher()) {
        Teacher.find({ where: { user_id: user.id } })
            .complete(function (err, teacher) {
                if (err) return console.error(err);
                classroom.setTeachers([teacher]).complete(function (err) {
                    if (err) return console.error(err);
                    return callback(classroom);
                });
            });
    } else if (user.isPreceptor()) {
        Preceptor.find({ where: { user_id: user.id } })
            .complete(function (err, preceptor) {
                if (err) return console.error(err);
                classroom.setPreceptor(preceptor).complete(function (err) {
                    if (err) return console.error(err);
                    return callback(classroom);
                });
            });
    }
};
