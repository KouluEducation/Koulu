var ClassroomSrv = require('../services/classroom');

module.exports = {

    seed: function () {
        var data = {
            name: '4to "C"',
            category: 'secondary'
        };
        return ClassroomSrv.createClassroom(data);
    }

};
