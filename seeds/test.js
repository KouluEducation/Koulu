var Test = require('../models').Test;

module.exports = {

    seed: function () {
        var data = {
            description: 'Ciclos iterativos',
            date: new Date()
        };
        return Test.createOne(data);
    }

};
