"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_todo_description", {
      todoDescription_id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      todo_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
          model : 'tbl_todo',
          key : 'todo_id'
        },
        onDelete : 'CASCADE',
        onUpdate : 'CASCADE'
      },
      created_by: {
        type: Sequelize.INTEGER,
      },
      todo_description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_todo_description");
  },
};
