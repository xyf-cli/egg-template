'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Category = app.model.define('category', {
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
  });


  // Category.sync({ alter: true });


  return Category;
};
