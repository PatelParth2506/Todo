'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_todo_activitylog', {
      log_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      method: {
        type: Sequelize.STRING
      },
      url : {
        type : Sequelize.STRING
      },
      status : {
        type : Sequelize.INTEGER
      },
      response_time : {
        type : Sequelize.FLOAT
      },
      ip : {
        type : Sequelize.STRING
      },
      userAgent : {
        type : Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_todo_activitylog');
  }
};