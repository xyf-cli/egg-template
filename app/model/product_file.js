'use strict';
const moment = require('moment');

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const ProductFile = app.model.define('product_file', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    file_origin_name: {
      type: STRING(64),
      allowNull: false,
      comment: '文件原始名称',
    },
    prod_id: {
      type: INTEGER,
      comment: '产品id',
    },
    // file_status: {
    //   type: INTEGER,
    //   allowNull: false,
    //   defaultValue: 0,
    //   comment: '图片是否有效：0无效，1有效'
    // },
    file_mark: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '图片归属标识。0商品预览,1商品详情',
    },
    file_order: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '图片排序',
    },
    file_is_master: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '是否主图：0否，1是',
    },
    file_name: {
      type: STRING(64),
      allowNull: false,
      comment: '文件名称',
      unique: 'column',
    },
    file_path: {
      type: STRING(128),
      allowNull: false,
      comment: '文件路径',
      unique: 'column',
    },
    file_size: {
      type: INTEGER,
      allowNull: false,
      comment: '文件大小',
    },
    create_user_id: {
      type: INTEGER,
      allowNull: false,
      comment: '创建人',
    },
  });

  ProductFile.associate = function() {
    app.model.ProductFile.belongsTo(app.model.Product, { foreignKey: 'prod_id' });
  };

  // ProductFile.sync({ alter: true });

  return ProductFile;
};
