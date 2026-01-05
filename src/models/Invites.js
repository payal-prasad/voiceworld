const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Invites = sequelize.define(
  "invites",
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
    invited_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "declined"),
      defaultValue: "pending",
    },
    sent_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "invites",
    timestamps: false, // Using sent_at
    underscored: true,
    schema: "gmeet",
    indexes: [
      {
        name: "invites_id",
        fields: ["id"],
      },
      {
        name: "invites_meeting",
        fields: ["meeting_id"],
      },
    ],
  }
);

module.exports = Invites;
