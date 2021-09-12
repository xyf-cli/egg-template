'use strict';
const Service = require('egg').Service;
const fs = require('fs');
const path = require('path');

class ProductService extends Service {
  // 查询商品列表
  async indexAction(params) {
    const { app, ctx } = this;
    const userId = ctx.getUserId();
    const role = ctx.getUserRole();
    const { name = '', pageSize = '10', currentPage = '1' } = params;
    const Op = app.Sequelize.Op;
    const where = {
      prod_name: {
        [Op.like]: '%' + name + '%',
      },
      create_user_id: userId,
    };
    if (role === 'user') {
      delete where.create_user_id;
    }
    const { rows, count } = await ctx.model.Product.findAndCountAll({
      order: [[ 'updatedAt', 'DESC' ]],
      limit: Number(pageSize), // 每页多少条
      offset: Number(pageSize) * (Number(currentPage) - 1), // 跳过多少条
      where,
      distinct: true,
    });
    // rows.forEach(item => {
    //   item.setDataValue('cate_name', item.category.cate_name);
    // });
    return {
      results: rows,
      total: count,
    };
  }
  // 新增商品
  async createAction(params) {
    const { ctx } = this;
    const userId = ctx.getUserId();
    const { prod_name, cate_id, prod_price, prod_desc, prod_file_urls, prod_detail_file_urls } = params;
    const hasProduct = await ctx.model.Product.findOne({
      where: {
        prod_name,
        create_user_id: userId,
      },
    });
    if (hasProduct) {
      throw { status: 200, message: '产品已存在' };
    }
    const product = new ctx.model.Product();
    product.prod_name = prod_name;
    product.prod_price = prod_price;
    product.cate_id = cate_id;
    product.prod_desc = prod_desc;
    product.prod_file_urls = prod_file_urls;
    product.prod_detail_file_urls = prod_detail_file_urls;
    product.create_user_id = userId;
    await product.save();
    return '添加成功';
  }
  // 更新商品信息
  async updateAction(params, request) {
    const { ctx } = this;
    const userId = ctx.getUserId();
    const { id } = params;
    const { prod_name, cate_id, prod_price, prod_desc, prod_file_urls, prod_detail_file_urls } = request;
    await ctx.model.Product.update(
      {
        prod_name,
        cate_id,
        prod_price,
        prod_desc,
        prod_file_urls,
        prod_detail_file_urls,
      },
      {
        where: {
          id,
          create_user_id: userId,
        },
      }
    );
    return '更新成功';

  }
  // 查询商品详情
  async showAction(params) {
    const { ctx } = this;
    const { id } = params;
    const product = await ctx.model.Product.findOne({
      where: {
        id,
      },
    });
    return product;
  }
  // 删除商品
  async destroyAction(params) {
    const { ctx } = this;
    const userId = ctx.getUserId();
    const { id } = params;
    const hasProduct = await ctx.model.Product.findOne({
      where: {
        id,
        create_user_id: userId,
      },
    });
    if (!hasProduct) {
      throw { status: 200, message: '未找到要删除的商品' };
    }
    const result = await ctx.model.Product.destroy({
      where: {
        id,
        create_user_id: userId,
      },
    });
    return '删除成功';
  }
}
module.exports = ProductService;
