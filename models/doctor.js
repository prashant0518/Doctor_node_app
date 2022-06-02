const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Doctor = sequelize.define("doctor", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING(80),
        defaultValue: "",
        allowNull: true,
    },
    email: {
        type: Sequelize.STRING(90),
        defaultValue: "",
        // unique: true,
        allowNull: true,
    },
    productId: {
        type: Sequelize.STRING(90),
        defaultValue: "",
        allowNull: true,
    },
    priceId: {
        type: Sequelize.STRING(90),
        defaultValue: "",
        // unique: true,
        allowNull: true,
    },
    password: {
        type: Sequelize.STRING,
        defaultValue: "",
        allowNull: true
    },
    fee:{
        type: Sequelize.STRING,
        defaultValue:'',
        allowNull:true
    },
    extras: {
        type: Sequelize.JSONB,
        allowNull:true,
    },
    status:{
        type:Sequelize.STRING,
        allowNull:true
    }

});

module.exports = Doctor;