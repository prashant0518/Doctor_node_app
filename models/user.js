const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const User = sequelize.define("user", {
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
module.exports = User
