const sequelize = require("../config/database");
const Users = require("./Users");
const Meetings = require("./Meetings");
const Participants = require("./Participants");
const Messages = require("./Messages");
const Invites = require("./Invites");

// Define all relationships
const setupAssociations = () => {
  // Users ↔ Meetings (One-to-Many: host)
  Users.hasMany(Meetings, {
    foreignKey: "host_id",
    targetKey: "user_id",
    as: "hostedMeetings",
    onDelete: "CASCADE",
    constraints: false,
  });
  Meetings.belongsTo(Users, {
    foreignKey: "host_id",
    targetKey: "user_id",
    as: "host",
    constraints: false,
  });

  // Meetings ↔ Participants (One-to-Many)
  Meetings.hasMany(Participants, {
    foreignKey: "meeting_id",
    targetKey: "meeting_id",
    as: "participants",
    onDelete: "CASCADE",
    constraints: false,
  });
  Participants.belongsTo(Meetings, {
    foreignKey: "meeting_id",
    targetKey: "meeting_id",
    as: "meeting",
    constraints: false,
  });

  // Users ↔ Participants (One-to-Many)
  Users.hasMany(Participants, {
    foreignKey: "user_id",
    targetKey: "user_id",
    as: "participations",
    constraints: false,
  });
  Participants.belongsTo(Users, {
    foreignKey: "user_id",
    targetKey: "user_id",
    as: "user",
    constraints: false,
  });

  // Meetings ↔ Messages (One-to-Many)
  Meetings.hasMany(Messages, {
    foreignKey: "meeting_id",
    targetKey: "meeting_id",
    as: "messages",
    onDelete: "CASCADE",
    constraints: false,
  });
  Messages.belongsTo(Meetings, {
    foreignKey: "meeting_id",
    targetKey: "meeting_id",
    as: "meeting",
    constraints: false,
  });

  // Users ↔ Messages (One-to-Many)
  Users.hasMany(Messages, {
    foreignKey: "user_id",
    targetKey: "user_id",
    as: "messages",
    constraints: false,
  });
  Messages.belongsTo(Users, {
    foreignKey: "user_id",
    targetKey: "user_id",
    as: "sender",
    constraints: false,
  });

  // Meetings ↔ Invites (One-to-Many)
  Meetings.hasMany(Invites, {
    foreignKey: "meeting_id",
    targetKey: "meeting_id",
    as: "invites",
    onDelete: "CASCADE",
    constraints: false,
  });
  Invites.belongsTo(Meetings, {
    foreignKey: "meeting_id",
    targetKey: "meeting_id",
    as: "meeting",
    constraints: false,
  });
};

const db = {
  sequelize,
  Sequelize: require("sequelize"),
  Users,
  Meetings,
  Participants,
  Messages,
  Invites,
  setupAssociations,
};

module.exports = db;
