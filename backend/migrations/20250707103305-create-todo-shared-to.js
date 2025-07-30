'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_todo_sharedTo', {
      todoSharedTo_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sharedWithUser_id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        references : {
          model : 'tbl_todo_user',
          key : 'user_id'
        },
        onDelete : 'CASCADE',
        onUpdate : 'CASCADE'
      },
      todo_id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        references : {
          model : 'tbl_todo',
          key : 'todo_id'
        },
        onDelete : 'CASCADE',
        onUpdate : 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_todo_sharedTo');
  }
};