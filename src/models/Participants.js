const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Participant = sequelize.define(
  "participants",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    meeting_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("host", "presenter", "viewer"),
      defaultValue: "viewer",
    },

    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    left_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    is_muted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    is_video_on: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    is_screen_sharing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
    tableName: "participants",
  }
);

module.exports = Participant;
