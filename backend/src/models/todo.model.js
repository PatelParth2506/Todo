'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
        Todo.belongsTo(models.Category, { foreignKey : 'category_id', targetKey : 'category_id' })
        Todo.hasMany(models.TodoDescription, { foreignKey : 'todo_id',ssourceKey : 'todo_id' })
        Todo.hasMany(models.TodoSharedTo,{ foreignKey : 'todo_id', sourceKey : 'todo_id' })
    }
  }
  Todo.init({
    todo_id : {
      autoIncrement : true,
      primaryKey : true,
      allowNull : false,
      type : DataTypes.INTEGER
    },
    category_id : {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    todo_title : {
      type : DataTypes.STRING,
      allowNull : false
    },
    creted_by : {
      type : DataTypes.INTEGER,
      allowNull  : false
    },
    updated_by : {
      type : DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Todo',
    tableName : 'tbl_todo',
    timestamps : true
  });
  return Todo;
};