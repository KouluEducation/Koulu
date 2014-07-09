var models = require('../models'),
    Classroom = models.Classroom,
    Preceptor = models.Preceptor;

module.exports = {
    /**
     * Creates a classroom and associates it with its creator
     * @param data
     */
    createClassroom: function (data) {
        return Classroom.build({
            name: data.name,
            category: data.category
        }).save();
    }
};
