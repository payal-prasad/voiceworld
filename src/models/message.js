module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Message', {
    message_text: DataTypes.TEXT,
  });
};
