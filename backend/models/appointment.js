const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Appointment = sequelize.define("appointment", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    appointment_date: {
        type: Sequelize.STRING(50),
        defaultValue:'',

    },
    appointment_time: {
        type: Sequelize.STRING(15),
        defaultValue: "",
    },
    approval_status: {
        type: Sequelize.STRING(80),
        defaultValue: "",
        allowNull: true,
    },
    payment_status: {
        type: Sequelize.STRING(80),
        defaultValue: "",
        allowNull: true,
    },
    extras: {
        type: Sequelize.JSONB,
          allowNull:true,
    }, 

})

module.exports = Appointment