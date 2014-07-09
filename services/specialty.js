var Specialty = require('../models').Specialty;

module.exports = {
    /**
     * Creates a specialty and associates it with a classroom if present
     * @param data
     */
    createSpecialty: function (data) {
        return Specialty.findOrCreate({
            name: data.name
        });
    }
};
