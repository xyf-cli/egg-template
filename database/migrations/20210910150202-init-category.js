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
    await queryInterface.createTable('category', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cate_name: {
        type: STRING(64),
        allowNull: false,
        comment: '分类名',
        unique: 'column',
      },
      create_user_id: {
        type: INTEGER,
        allowNull: false,
        comment: '创建人',
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
    await queryInterface.dropTable('category');
  },
};
