
'use strict';
const Service = require('egg').Service;
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const fs = require('fs');
const qiniu = require('qiniu');

class FileService extends Service {

  // 获取七牛云 token
  qiniuToken() {
    const { ctx, config } = this;
    const accessKey = config.qiniu.accessKey;
    const secretKey = config.qiniu.secretKey;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: 'xyf-wine',
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    return uploadToken;
  }

  // 上传图片列表
  async indexAction() {
    const { ctx } = this;
    const userId = ctx.getUserId();
    const files = await ctx.model.ProductFile.findAll({
      where: {
        create_user_id: userId,
      },
    });
    return files;
  }

  // 七牛文件上传
  async qiniuHandleStream(stream) {
    const { config } = this;
    const uploadToken = this.qiniuToken();
    const qConfig = new qiniu.conf.Config();
    // 空间对应的机房
    qConfig.zone = qiniu.zone.Zone_z2; // 华南机房
    // 是否使用https域名
    qConfig.useHttpsDomain = false;
    // 上传是否使用cdn加速
    qConfig.useCdnDomain = true;

    const formUploader = new qiniu.form_up.FormUploader(qConfig);
    const putExtra = new qiniu.form_up.PutExtra();

    // 生成时间戳文件名（extname：获取文件后缀）
    const fileName = Date.now() + '_' + stream.filename;

    const readableStream = stream; // 可读的流
    try {
      const data = await new Promise((resolve, reject) => {
        formUploader.putStream(uploadToken, fileName, readableStream, putExtra, function(respErr,
          respBody, respInfo) {
          if (respErr) {
            reject(respErr);
          }
          if (respInfo.statusCode === 200) {
            resolve(respBody.key);
          } else {
            reject(respBody);
          }
        });
      });
      return {
        filePath: config.qiniu.baseUrl + '/' + data,
        fileName: data,
      };
    } catch (e) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream);
      return JSON.stringify(e);
    }


    // const { ctx, config } = this;
    // // 生成时间戳文件名（extname：获取文件后缀）
    // const fileName = Date.now() + '_' + stream.filename;
    // // 服务器上传目录
    // const uploadPath = path.join(config.fileConfig.savePath);
    // // 以同步的方法检测目录是否存在
    // if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    // // 服务器上文件位置（含路径和文件名）
    // const localFilePath = path.join(uploadPath, `${fileName}`);
    // // 接口请求返回的文件地址
    // const filePath = `${config.fileConfig.requestPath}${fileName}`;
    // // 创建一个可以写入的流
    // const result = await new Promise((resolve, reject) => {
    //   const writeStream = fs.createWriteStream(localFilePath);
    //   stream.pipe(writeStream);
    //   let errFlag;
    //   writeStream.on('error', err => {
    //     errFlag = true;
    //     sendToWormhole(stream);
    //     writeStream.destroy();
    //     reject(err);
    //   });
    //   writeStream.on('finish', async () => {
    //     if (errFlag) return;
    //     const stats = fs.statSync(localFilePath);
    //     resolve({ fileName, filePath, fileSize: stats.size, oldFileName: stream.filename, fieldname: stream.fieldname });
    //   });
    // });
    // return result;
  }

  // 单个文件流处理方法
  async handleStream(stream) {
    const { ctx, config } = this;
    // 生成时间戳文件名（extname：获取文件后缀）
    const fileName = Date.now() + '_' + stream.filename;
    // 服务器上传目录
    const uploadPath = path.join(config.fileConfig.savePath);
    // 以同步的方法检测目录是否存在
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    // 服务器上文件位置（含路径和文件名）
    const localFilePath = path.join(uploadPath, `${fileName}`);
    // 接口请求返回的文件地址
    const filePath = `${config.fileConfig.requestPath}${fileName}`;
    // 创建一个可以写入的流
    const result = await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(localFilePath);
      stream.pipe(writeStream);
      let errFlag;
      writeStream.on('error', err => {
        errFlag = true;
        sendToWormhole(stream);
        writeStream.destroy();
        reject(err);
      });
      writeStream.on('finish', async () => {
        if (errFlag) return;
        const stats = fs.statSync(localFilePath);
        resolve({ fileName, filePath, fileSize: stats.size, oldFileName: stream.filename, fieldname: stream.fieldname });
      });
    });
    return result;
  }

  // 图片上传后信息存入数据库
  async uploadAction(params) {
    const { app, ctx } = this;
    const userId = ctx.getUserId();
    const { oldFileName, fileName, filePath, fileSize, fieldname } = params;
    const file = new ctx.model.ProductFile();
    // 图片分预览图和详情图
    if (fieldname === 'detail') {
      file.file_mark = 1;
    }
    file.file_name = fileName; // 时间戳文件名
    file.file_path = filePath;
    file.file_size = fileSize;
    file.file_origin_name = oldFileName; // 原文件名
    file.create_user_id = userId;
    const result = await file.save();
    return result;
  }

  // 删除图片
  async destroyAction(params) {
    const { app, ctx } = this;
    const userId = ctx.getUserId();
    const { id } = params;
    const result = await ctx.model.ProductFile.destroy({
      where: {
        id,
        create_user_id: userId,
      },
    });
    return `已删除${result}条`;
  }


}
module.exports = FileService;
