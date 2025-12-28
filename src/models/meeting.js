module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Meeting', {
    title: DataTypes.STRING,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
  });
};
