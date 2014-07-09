var Subject = require('../models').Subject;

module.exports = {
    /**
     * Creates a subject and associates it with a classroom if present
     * @param data
     */
    createSubject: function (data) {
        return Subject.findOrCreate({
            name: data.name
        });
    }
};
