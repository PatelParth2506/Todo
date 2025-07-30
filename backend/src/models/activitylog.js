'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ActivityLog extends Model {
    static associate(models) {
      // define association here
    }
  }
  ActivityLog.init({
    log_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      method: {
        type: DataTypes.STRING
      },
      url : {
        type : DataTypes.STRING
      },
      status : {
        type : DataTypes.INTEGER
      },
      response_time : {
        type : DataTypes.FLOAT
      },
      ip : {
        type : DataTypes.STRING
      },
      userAgent : {
        type : DataTypes.TEXT
      },
  }, {
    sequelize,
    modelName: 'ActivityLog',
    tableName : 'tbl_todo_activitylog',
    timestamps : true,
    createdAt : 'created_at',
    updatedAt : false
  });
  return ActivityLog;
};