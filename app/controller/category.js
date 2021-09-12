'use strict';

const Controller = require('egg').Controller;

class CategoryController extends Controller {
  // 查询分类列表
  async index() {
    const { ctx } = this;
    const result = await ctx.service.category.indexAction(ctx.query);
    ctx.success('查询成功', result);
  }
  // 新增分类
  async create() {
    const { ctx } = this;
    ctx.validate({
      cate_name: { type: 'string' },
    });
    const result = await ctx.service.category.createAction(ctx.request.body);
    ctx.success(result);
  }
  // 查询分类详情
  async show() {
    const { ctx } = this;
    const rules = {
      id: { type: 'id' },
    };
    ctx.validate(
      rules,
      ctx.params
    );
    const result = await ctx.service.category.showAction(ctx.params);
    ctx.success('查询成功', result);
  }
  // 更新分类信息
  async update() {
    const { ctx } = this;
    const rules = {
      cate_name: { type: 'string' },
    };
    ctx.validate(rules);
    const result = await ctx.service.category.updateAction(ctx.params, ctx.request.body);
    ctx.success(result);
  }
  // 删除分类
  async destroy() {
    const { ctx } = this;
    const rules = {
      id: { type: 'id' },
    };
    ctx.validate(
      rules,
      ctx.params
    );
    const result = await ctx.service.category.destroyAction(ctx.params);
    ctx.success(result);
  }
}

module.exports = CategoryController;
