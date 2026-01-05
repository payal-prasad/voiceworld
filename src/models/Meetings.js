const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Meetings = sequelize.define(
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
    host_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meeting_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("scheduled", "ongoing", "ended"),
      defaultValue: "scheduled",
    },
    max_participants: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    is_private: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recording_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "meetings",
    timestamps: true,
    underscored: true,
    schema: "gmeet",
    indexes: [
      {
        name: "meetings_id",
        fields: ["id"],
      },
      {
        name: "meetings_id_field",
        fields: ["meeting_id"],
      },
    ],
  }
);

module.exports = Meetings;
