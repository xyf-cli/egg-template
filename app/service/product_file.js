const Service = require("egg").Service;
const path = require('path')
const sendToWormhole = require('stream-wormhole');
const fs = require('fs')

class FileService extends Service {

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

  // 单个文件流处理方法
  async handleStream(stream) {
    const { ctx, config } = this;
    // 生成时间戳文件名（extname：获取文件后缀）
    const fileName = Date.now() + path.extname(stream.filename).toLocaleLowerCase();
    // 服务器上传目录
    const uploadPath = path.join(config.fileConfig.savePath);
    // 以同步的方法检测目录是否存在
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    // 服务器上文件位置（含路径和文件名）
    let localFilePath = path.join(uploadPath, `${fileName}`);
    // 接口请求返回的文件地址
    let filePath = `${config.fileConfig.requestPath}${fileName}`;
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
        var stats = fs.statSync(localFilePath);
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
    file.file_name = fileName; //时间戳文件名
    file.file_path = filePath;
    file.file_size = fileSize;
    file.file_origin_name = oldFileName; //原文件名
    file.create_user_id = userId;
    const result = await file.save();
    return result;
  }

  //删除图片
  async destroyAction(params) {
    const { app, ctx } = this;
    const userId = ctx.getUserId();
    const { id } = params;
    const result = await ctx.model.ProductFile.destroy({
      where: {
        id: id,
        create_user_id: userId
      }
    })
    return `已删除${result}条`
  }





}
module.exports = FileService;
