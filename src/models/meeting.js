// models/meeting.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Meeting = sequelize.define(
  "meetings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    host_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Meeting;
