'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TodoSharedTo extends Model {
    static associate(models) {
      TodoSharedTo.belongsTo(models.Todo,{ foreignKey : 'todo_id',targetKey : 'todo_id' })
      TodoSharedTo.belongsTo(models.User,{ foreignKey : 'sharedWithUser_id', targetKey : 'user_id'})
    }
  }
  TodoSharedTo.init({
    todoSharedTo_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      sharedWithUser_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
      },
      todo_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
      }
  }, {
    sequelize,
    modelName: 'TodoSharedTo',
    tableName : 'tbl_todo_sharedTo',
    timestamps : true
  });
  return TodoSharedTo;
};