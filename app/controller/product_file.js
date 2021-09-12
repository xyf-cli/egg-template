'use strict';

const Controller = require('egg').Controller;

class FileController extends Controller {
  // 图片列表
  async index() {
    const { ctx } = this;
    const files = await ctx.service.productFile.indexAction();
    ctx.success('查询成功', files);
  }
  // 单文件上传
  async upload() {
    const { ctx, config } = this;
    // 读取表单提交的文件流
    const stream = await ctx.getFileStream();
    const result = await ctx.service.productFile.qiniuHandleStream(stream);
    // return result;
    // const fileInfo = await ctx.service.productFile.uploadAction(result);
    ctx.success('添加成功', result);
  }
  // 多文件上传
  async multiUpload() {
    const { ctx, config } = this;
    const parts = ctx.multipart();
    let part;
    // parts() 返回 promise 对象
    while ((part = await parts()) != null) {
      if (part.length) {
        // 这是 busboy 的字段
        console.log('field: ' + part[0]);
        console.log('value: ' + part[1]);
        console.log('valueTruncated: ' + part[2]);
        console.log('fieldnameTruncated: ' + part[3]);
      } else {
        if (!part.filename) {
          // 这时是用户没有选择文件就点击了上传(part 是 file stream，但是 part.filename 为空)
          // 需要做出处理，例如给出错误提示消息
          return;
        }
        // part 是上传的文件流
        console.log('field: ' + part.fieldname);
        console.log('filename: ' + part.filename);
        console.log('encoding: ' + part.encoding);
        console.log('mime: ' + part.mime);
        // 文件处理，上传到云存储等等
        const result = await ctx.service.productFile.qiniuHandleStream(part);
        // const fileInfo = await ctx.service.productFile.uploadAction(result);
        ctx.success('添加成功', result);
      }
    }
  }
  // 删除图片(支持多张)
  async destroy() {
    const { ctx } = this;
    const result = await ctx.service.productFile.destroyAction(ctx.params);
    ctx.success('删除成功', result);
  }

}

module.exports = FileController;
