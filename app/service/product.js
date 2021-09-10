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
    rows.forEach(item => {
      item.setDataValue('cate_name', item.category.cate_name);
    });
    return {
      results: rows,
      total: count,
    };
  }
  // 新增商品
  async createAction(params) {
    const { ctx } = this;
    const userId = ctx.getUserId();
    const { prod_name, cate_id, prod_price, prod_desc, prod_file_list } = params;
    const t = await ctx.model.transaction();
    const hasProduct = await ctx.model.Product.findOne({
      where: {
        prod_name,
        create_user_id: userId,
      },
    });
    if (hasProduct) {
      throw { status: 200, message: '产品已存在' };
    }
    try {
      const product = new ctx.model.Product();
      product.prod_name = prod_name;
      product.prod_price = prod_price;
      product.cate_id = cate_id;
      product.prod_desc = prod_desc;
      product.create_user_id = userId;
      const prod = await product.save();
      prod_file_list.forEach(async item => {
        await ctx.model.ProductFile.update(
          {
            prod_id: prod.id,
          },
          {
            where: {
              id: item.id,
            },
          }
        );
      });
      await t.commit();
      return '添加成功';
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }
  // 更新商品信息
  async updateAction(params, request) {
    const { ctx } = this;
    const userId = ctx.getUserId();
    const { id } = params;
    const { prod_name, cate_id, prod_price, prod_desc, prod_file_list } = request;
    const t = await ctx.model.transaction();
    try {
      const product = await ctx.model.Product.update(
        {
          prod_name,
          cate_id,
          prod_price,
          prod_desc,
        },
        {
          where: {
            id,
            create_user_id: userId,
          },
        }
      );
      await ctx.model.ProductFile.update(
        {
          prod_id: null,
        },
        {
          where: {
            prod_id: id,
          },
        }
      );
      const fileIds = prod_file_list.map(item => {
        return item.id;
      });
      await ctx.model.ProductFile.update(
        {
          prod_id: id,
        },
        {
          where: {
            id: fileIds,
          },
        }
      );
      await t.commit();
      return '更新成功';
    } catch (e) {
      await t.rollback();
      throw e;
    }
  }
  // 查询商品详情
  async showAction(params) {
    const { ctx } = this;
    const { id } = params;
    const product = await ctx.model.Product.findOne({
      where: {
        id,
      },
      include: [{
        as: 'product_preview_files',
        model: ctx.model.ProductFile,
        attributes: [ 'file_name', 'file_path', 'id' ],
        where: {
          file_mark: 0,
        },
        required: false,
      }, {
        as: 'product_detail_files',
        model: ctx.model.ProductFile,
        attributes: [ 'file_name', 'file_path', 'id' ],
        where: {
          file_mark: 1,
        },
        required: false,
      }],
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
