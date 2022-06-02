const Sequelize = require('sequelize');

console.log('DB host ' + process.env.DB_HOST)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PSWD, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    // logging: false,

});

module.exports = sequelize;