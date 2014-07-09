var SubjectSrv = require('../services/subject');

module.exports = {

    seed: function (classroom) {
        var data = {
            name: 'Laboratorio de Programación'
        };
        return SubjectSrv.createSubject(data);
    }

};
