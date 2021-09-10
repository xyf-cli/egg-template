'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const { STRING, INTEGER, DATE } = Sequelize;
    await queryInterface.createTable('admin', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nickname: {
        type: STRING(64),
        allowNull: false,
        comment: '管理员昵称',
      },
      email: {
        type: STRING(128),
        unique: 'column',
        allowNull: false,
        comment: '管理员邮箱',
      },
      password: {
        type: STRING,
        allowNull: false,
        comment: '管理员密码',
      },
      createdAt: DATE,
      updatedAt: DATE,
    });
  },

  down: async queryInterface => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('admin');
  },
};
