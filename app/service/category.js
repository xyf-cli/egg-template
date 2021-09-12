'use strict';
const Service = require('egg').Service;

class CategoryService extends Service {
  // 查询分类列表
  async indexAction(params) {
    const { app, ctx } = this;
    const Op = app.Sequelize.Op;
    const userId = ctx.getUserId();
    const name = params.name || '';
    const pageSize = Number(params.pageSize) || 10;
    const currentPage = Number(params.currentPage) || 1;
    const { count, rows } = await ctx.model.Category.findAndCountAll({
      order: [[ 'updatedAt', 'DESC' ]],
      limit: pageSize, // 每页多少条
      offset: pageSize * (currentPage - 1), // 跳过多少条
      where: {
        cate_name: {
          [Op.like]: '%' + name + '%',
        },
        create_user_id: userId,
      },
    });
    return {
      results: rows,
      total: count,
    };
  }
  // 新增分类
  async createAction(params) {
    const { ctx } = this;
    const { cate_name } = params;
    const userId = ctx.getUserId();
    const hasCategory = await ctx.model.Category.findOne({
      where: {
        cate_name,
        create_user_id: userId,
      },
    });
    if (hasCategory) {
      throw { status: 200, message: '分类已存在' };
    }
    const category = new ctx.model.Category();
    category.cate_name = cate_name;
    category.create_user_id = userId;
    await category.save();
    return '添加成功';
  }
  // 更新分类信息
  async updateAction(params, request) {
    const { ctx } = this;
    const { cate_name } = request;
    const { id } = params;
    const userId = ctx.getUserId();
    await ctx.model.Category.update(
      { cate_name },
      {
        where: {
          id,
          create_user_id: userId,
        },
      }
    );
    return '更新成功';
  }
  // 查询分类详情
  async showAction(params) {
    const { ctx } = this;
    const { id } = params;
    const userId = ctx.getUserId();
    const category = await ctx.model.Category.findOne({
      where: {
        id,
        create_user_id: userId,
      },
    });
    return category;
  }
  // 删除分类
  async destroyAction(params) {
    const { ctx } = this;
    const { id } = params;
    const userId = ctx.getUserId();
    const hasCategory = await ctx.model.Category.findOne({
      where: {
        id,
        create_user_id: userId,
      },
    });
    if (!hasCategory) {
      throw { status: 200, message: '未找到要删除的分类' };
    }
    const linkProduct = await ctx.model.Product.findAndCountAll({
      where: {
        cate_id: id,
      },
    });
    if (linkProduct.count) {
      throw { status: 200, message: `该分类下有${linkProduct.count}个关联的商品` };
    }
    await ctx.model.Category.destroy({
      where: {
        id,
        create_user_id: userId,
      },
    });
    return '删除成功';
  }
}
module.exports = CategoryService;
