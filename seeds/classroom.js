var Classroom = require('../models').Classroom;

module.exports = {

    seed: function () {
        var data = {
            name: '4to "C"',
            category: 'secondary'
        };
        return Classroom.createOne(data);
    }

};
