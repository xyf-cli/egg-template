'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
  async login() {
    const { ctx } = this;
    const rules = {
      email: { type: 'email' },
      password: { type: 'password' },
    };
    ctx.validate(rules);
    const result = await ctx.service.admin.loginAction(ctx.request.body);
    const now = new Date().getTime();
    const tokenTime = 1000 * 60 * 60 * 24 * ctx.app.config.jwt.expiredTime; // token可用时长毫秒
    const token = ctx.app.jwt.sign(
      {
        role: 'admin',
        userId: result.id,
        exp: parseInt((now + tokenTime) / 1000),
      },
      ctx.app.config.jwt.secret
    );
    ctx.body = {
      success: true,
      msg: '查询成功',
      data: result,
      token,
    };
  }
  async register() {
    const { ctx } = this;
    const rules = {
      nickname: { type: 'string', min: 3, max: 20 },
      email: { type: 'email' },
      password: { type: 'password' },
    };
    ctx.validate(rules);
    const result = await ctx.service.admin.registerAction(ctx.request.body);
    ctx.success('创建成功', result);
  }
}

module.exports = AdminController;
