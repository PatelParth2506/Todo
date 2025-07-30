'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TodoDescription extends Model {
    static associate(models) {
        TodoDescription.belongsTo(models.Todo, { foreignKey : 'todo_id', targetKey : 'todo_id' })
    }
  }
  TodoDescription.init({
    todoDescription_id : { 
      primaryKey : true,
      autoIncrement : true,
      allowNull : false,
      type : DataTypes.INTEGER
    },
    todo_id : {
      type : DataTypes.INTEGER,
      allowNull : false
    },
    created_by : {
      type : DataTypes.INTEGER
    },
    todo_description : { 
      type : DataTypes.STRING,
      allowNull : false
    }
  }, {
    sequelize,
    modelName: 'TodoDescription',
    tableName: 'tbl_todo_description',
    timestamps : true
  });
  return TodoDescription;
};