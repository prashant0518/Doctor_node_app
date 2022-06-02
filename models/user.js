const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Patient = sequelize.define("patient", {
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
        unique: true,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(90),
        defaultValue: "",
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        defaultValue: "",
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: true,
      },
      status:{
          type:Sequelize.STRING,
          allowNull:true
      }
})
module.exports = Patient
