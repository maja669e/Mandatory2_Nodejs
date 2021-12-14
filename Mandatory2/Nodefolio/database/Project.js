const {
    Model,
    DataTypes
} = require('sequelize');
const sequelize = require('./database');

class Project extends Model {};

Project.init({
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    }
}, {
 sequelize, 
 modelName: 'project'
})

module.exports = Project;