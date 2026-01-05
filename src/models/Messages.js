const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Messages = sequelize.define(
  "messages",
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
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("text", "file"),
      defaultValue: "text",
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "messages",
    timestamps: false, // Using timestamp field
    underscored: true,
    schema: "gmeet",
    indexes: [
      {
        name: "messages_id",
        fields: ["id"],
      },
      {
        name: "messages_meeting",
        fields: ["meeting_id"],
      },
    ],
  }
);

module.exports = Messages;
