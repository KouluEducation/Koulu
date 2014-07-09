var Specialty = require('../services/specialty');

module.exports = {

    seed: function () {
        var data = {
            name: 'Informática'
        };
        return Specialty.createSpecialty(data);
    }

};
