'use strict';
const bcrypt = require('bcryptjs');

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Admin = app.model.define('admin', {
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
      set(val) {
        // 加密
        const salt = bcrypt.genSaltSync(10);
        // 生成加密密码
        const psw = bcrypt.hashSync(val, salt);
        this.setDataValue('password', psw);
      },
      allowNull: false,
      comment: '管理员密码',
    },
  });

  // Admin.sync({ alter: true });

  return Admin;
};
