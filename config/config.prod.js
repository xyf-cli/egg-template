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

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1599843766917_4844';

  // plugin
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'egg_admin_prod',
    username: 'root',
    password: '88888888',
    timezone: '+08:00',
    dialectOptions: {
      useUTC: false, // for reading from database
      dateStrings: true,
      typeCast(field, next) { // for reading from database
        if (field.type === 'DATETIME') {
          return field.string();
        }
        return next();
      },
    },
  };

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: 'auth',
      db: 0,
    },
  };


  return {
    ...config,
  };
};
