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
    await queryInterface.createTable('product', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      prod_name: {
        type: STRING(64),
        allowNull: false,
        comment: '商品名',
        unique: 'column',
      },
      prod_sales_promotion: {
        type: STRING(255),
        allowNull: true,
        comment: '商品促销',
      },
      cate_id: {
        type: INTEGER,
        allowNull: false,
        comment: '分类id',
      },
      prod_price: {
        type: INTEGER,
        allowNull: false,
        comment: '价格',
      },
      prod_desc: {
        type: STRING(64),
        allowNull: true,
        comment: '商品描述',
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
    await queryInterface.dropTable('product');
  },
};
