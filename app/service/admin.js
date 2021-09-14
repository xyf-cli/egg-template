'use strict';

const Service = require('egg').Service;
const bcrypt = require('bcryptjs');

class UserService extends Service {

  // 查询用户信息
  async find(uid) {
    const { ctx } = this;
    const user = await ctx.model.Admin.findOne({
      where: {
        id: uid,
      },
    });
    return {
      nickname: user.nickname,
      email: user.email,
    };
  }

  // 验证密码
  async loginAction(params) {
    const { ctx } = this;
    const { email, password } = params;
    const admin = await ctx.model.Admin.findOne({
      where: {
        email,
      },
    });
    if (!admin) {
      throw { status: 401, message: '账号不存在' };
    }
    const correct = bcrypt.compareSync(password, admin.password);
    if (!correct) {
      throw { status: 401, message: '账号或密码不正确' };
    }
    return admin;
  }

  // 创建账号
  async registerAction(params) {
    const { ctx } = this;
    const { nickname, email, password } = params;
    const hasAdmin = await ctx.model.Admin.findOne({
      where: {
        email,
      },
    });
    if (hasAdmin) {
      throw { status: 401, message: '账号已存在' };
    }
    const admin = new ctx.model.Admin();
    admin.email = email;
    admin.nickname = nickname;
    admin.password = password;
    await admin.save();
    return {
      email,
      nickname,
    };
  }

}
module.exports = UserService;
