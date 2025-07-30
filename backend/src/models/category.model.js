'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
        Category.belongsTo(models.User,{ foreignKey : 'user_id', targetKey : 'user_id' })
        Category.hasMany(models.Todo,{ foreignKey : 'category_id', sourceKey : 'category_id' })
    }
  }
  Category.init({
    category_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      category_name: {
        type: DataTypes.STRING,
        allowNull : false
      },
      user_id : {
        type : DataTypes.INTEGER,
        allowNull : false
      },
  }, {
    sequelize,
    modelName: 'Category',
    tableName : 'tbl_todo_category',
    timestamps : true
  });
  return Category;
};