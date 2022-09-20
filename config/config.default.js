/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  config.thisDomain = 'http://localhost:7001';
  config.fileConfig = {
    savePath: 'app/public/uploads/', // 上传文件存储路径
    requestPath: '/public/uploads/', // 上传文件访问路径
  };

  config.qiniu = {
    baseUrl: 'http://test.oss.geek32.com',
    accessKey: 'MXiM2d92FhVUPV0a5NYdpf_gH2y72wdaGxRiDxxn',
    secretKey: '2-YP7l8QM1OyFD-5qia2P-8pRofI3oe0dfzGbQCP',
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1599843766917_4844';

  // add your middleware config here
  config.middleware = [ 'errorHandler' ];

  // plugin
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'egg_admin_dev',
    username: 'root',
    password: '88888888',
    define: {
      freezeTableName: true,
    },
  };

  // config.session = {
  //   key: 'EGG_SESS',
  //   // maxAge: 24 * 3600 * 1000, // 1 天
  //   maxAge: 10 * 1000,
  //   httpOnly: true,
  //   encrypt: true,
  // };

  config.jwt = {
    secret: '123456', // 自定义 token 的加密条件字符串
    expiredTime: '30', // 过期时间(天)
  };

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: 'auth',
      db: 0,
    },
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '*' ],
  };

  config.cors = {
    // origin默认读security.domainWhiteList
    // origin: "http://localhost:8080/",
    origin: '*',
    // credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // config.multipart = {
  //   mode: 'file',
  // };

  return {
    ...config,
  };
};
