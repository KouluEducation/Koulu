var Specialty = require('../models').Specialty;

module.exports = {

    seed: function () {
        var data = {
            name: 'Informática'
        };
        return Specialty.createOne(data);
    }

};
