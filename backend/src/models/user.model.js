'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
        User.hasMany(models.Category, { foreignKey : 'user_id',sourceKey : 'user_id' })
        User.hasMany(models.TodoSharedTo,{ foreignKey : 'sharedWithUser_id', sourceKey : 'user_id'})
    }
  }
  User.init({
    user_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    username:{
      type:DataTypes.STRING, 
      allowNull:false,
      unique : true,
      validate:{
        len:[4-20]
      }
    },
    password:{
      type:DataTypes.STRING,
    },
    email:{
      type:DataTypes.STRING,
      allowNull:false,
      unique : true
    },
    profilePhoto:{
      type:DataTypes.STRING
    },
    signWithplatform:{
      type:DataTypes.STRING
    },
    isEmailVerified : {
      type : DataTypes.BOOLEAN,
      defaultValue : false,
      allowNull : false
    },
    firebase_uid: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName : 'tbl_todo_user',
    timestamps : true
  });
  return User;
};