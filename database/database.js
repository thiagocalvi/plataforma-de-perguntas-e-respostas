const sequelize = require('sequelize');
const connection = new sequelize('guiaperguntas', 'root', 'install', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;
