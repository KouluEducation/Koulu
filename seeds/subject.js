var Subject = require('../models').Subject;

module.exports = {

    seed: function () {
        var data = {
            name: 'Laboratorio de Programación'
        };
        return Subject.createOne(data);
    }

};
