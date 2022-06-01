const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Member = sequelize.define("member", {
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

module.exports = Member;