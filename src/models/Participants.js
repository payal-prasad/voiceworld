const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Participants = sequelize.define(
  "participants",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    meeting_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
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
    tableName: "participants",
    timestamps: false, // No createdAt/updatedAt since we have joined_at/left_at
    underscored: true,
    schema: "gmeet",
    indexes: [
      {
        name: "participants_id",
        fields: ["id"],
      },
      {
        name: "participants_meeting_user",
        fields: ["meeting_id", "user_id"],
      },
    ],
  }
);

module.exports = Participants;
