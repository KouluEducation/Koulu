'use strict';

var fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    sequelize = new Sequelize('koulu', 'root', 'root', {
        define: {
            paranoid: true,
            underscored: true,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        }
    }),
    _ = require('lodash'),
    db = {};

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

module.exports = _.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);
