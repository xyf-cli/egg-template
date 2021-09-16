'use strict';
// 后台管理端商品列表

const Controller = require('egg').Controller;

class MpProductController extends Controller {
  // 查询商品列表
  async index() {
    const { ctx } = this;
    const rules = {
      pageSize: { type: 'id', required: false },
      currentPage: { type: 'id', required: false },
      name: { type: 'string', required: false },
    };
    ctx.validate(rules, ctx.query);
    const result = await ctx.service.mpProduct.indexAction(ctx.query);
    ctx.success('查询成功', result);
  }
  // 新增商品
  async create() {
    const { ctx } = this;
    const rules = {
      prod_name: { type: 'string', min: 2, max: 50 },
      prod_price: { type: 'number', min: 0, max: 99999 },
      prod_desc: { type: 'string', required: false },
      cate_id: { type: 'number', required: true },
      prod_file_urls: { type: 'string', required: false },
      prod_detail_file_urls: { type: 'string', required: false },
    };
    ctx.validate(rules);
    const result = await ctx.service.mpProduct.createAction(ctx.request.body);
    ctx.success(result);
  }
  // 更新商品信息
  async update() {
    const { ctx } = this;
    const rules = {
      prod_name: { type: 'string', min: 2, max: 50 },
      prod_price: { type: 'number', min: 0, max: 99999 },
      prod_desc: { type: 'string', required: false },
      cate_id: { type: 'number', required: true },
      prod_file_urls: { type: 'string', required: false },
      prod_detail_file_urls: { type: 'string', required: false },
    };
    ctx.validate(rules);
    const result = await ctx.service.mpProduct.updateAction(ctx.params, ctx.request.body);
    ctx.success(result);
  }
  // 查询商品详情
  async show() {
    const { ctx } = this;
    const rules = {
      id: { type: 'id' },
    };
    ctx.validate(
      rules,
      ctx.params
    );
    const result = await ctx.service.mpProduct.showAction(ctx.params);
    ctx.success('查询成功', result);
  }

  // 删除商品
  async destroy() {
    const { ctx } = this;
    const rules = {
      id: { type: 'id' },
    };
    ctx.validate(
      rules,
      ctx.params
    );
    const result = await ctx.service.mpProduct.destroyAction(ctx.params);
    ctx.success(result);

  }
}

module.exports = MpProductController;
