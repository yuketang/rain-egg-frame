'use strict';

const ip = require('ip');
const fs = require('fs');
const path = require('path');

/**
 * 文档： https://eggjs.org/api/config_config.default.js.html
 * 说明：config 默认加载 config.default.js, config.{env}.js , config.{env}.js 会覆盖 config.default.js 中的同名配置
 *
 config
 |- config.default.js
 |- config.test.js
 |- config.prod.js
 |- config.unittest.js
 `- config.local.js
 *
 */
module.exports = appInfo => {
  const config = {
    tracelog: {
      Tracer: require('../lib/Tracer.js'),
    },
    tracer: {
      Class: require('../lib/Tracer.js'),
    },
    // static: {
    //     prefix: '',
    //     dir: path.join(appInfo.baseDir, 'app/public'),
    //     dynamic: true,
    //     preload: false,
    //     maxAge: 31536000,
    //     buffer: false,
    // },
    // coreMiddleware: [
    //   'first',
    //   'meta',
    //   'siteFile',
    //   'fmtResponse',
    //   'accessLog',
    //   'error404',
    //   'bodyParser',
    //   'overrideMethod',
    // ],
    // siteFile: {
    //     '/favicon.ico': fs.readFileSync(path.join(__dirname, 'favicon.ico')),
    // },
    maxAge: 86400000, // Session 的最大有效时间

    // customLogger: {
    //     accessLogger: {
    //         file: path.join(appInfo.baseDir, `logs/${appInfo.name}-access.log`),
    //     },
    // },


    // logrotator: { // 切割日志，默认按天
    //     filesRotateByHour: [ 'app', 'core', 'agent', 'error' ].map(item => path.join(appInfo.baseDir, 'logs', `${appInfo.name}-${item}.log`)), // 按小时切割日志
    // },
    bodyParser: {
      jsonLimit: '10mb', // default: 100kb
      formLimit: '10mb', // default: 100kb
    },

    multipart: {
      fileExtensions: ['.apk'], // 增加对 .apk 扩展名的支持
      whitelist: ['.png'], // 覆盖整个白名单，只允许上传 '.png' 格式; 当传递了 whitelist 属性时，fileExtensions 属性不生效。
      /** 默认支持的白名单
       // images
       '.jpg', '.jpeg', // image/jpeg
       '.png', // image/png, image/x-png
       '.gif', // image/gif
       '.bmp', // image/bmp
       '.wbmp', // image/vnd.wap.wbmp
       '.webp',
       '.tif',
       '.psd',
       // text
       '.svg',
       '.js', '.jsx',
       '.json',
       '.css', '.less',
       '.html', '.htm',
       '.xml',
       // tar
       '.zip',
       '.gz', '.tgz', '.gzip',
       // video
       '.mp3',
       '.mp4',
       '.avi',
       */
    },
    jsonp: {
      // callback: 'callback', // 识别 query 中的 `callback` 参数, 默认 _callback
      limit: 100, // 函数名最长为 100 个字符
      csrf: true, // 如果在同一个主域之下，可以通过开启 CSRF 的方式来校验 JSONP 请求的来源
      whiteList: /^https?:\/\/test.com\//, // 如果想对其他域名的网页提供 JSONP 服务，我们可以通过配置 referrer 白名单的方式来限制 JSONP 的请求方在可控范围之内
      // whiteList: '.test.com',
      // whiteList: 'sub.test.com',
      // whiteList: [ 'sub.test.com', 'sub2.test.com' ],

    },
    // httpclient: {
    //     enableDNSCache: false,
    //     dnsCacheMaxLength: 1000,
    //     dnsCacheMaxAge: 10000,
    //     request: {
    //         timeout: 5000,
    //     },
    //     httpAgent: {
    //         keepAlive: true,
    //         freeSocketKeepAliveTimeout: 4000,
    //         maxSockets: Number.MAX_SAFE_INTEGER,
    //         maxFreeSockets: 256,
    //     },
    //     httpsAgent: {
    //         keepAlive: true,
    //         freeSocketKeepAliveTimeout: 4000,
    //         maxSockets: Number.MAX_SAFE_INTEGER,
    //         maxFreeSockets: 256,
    //     },
    // },
    // httpclient : {
    //     // 是否开启本地 DNS 缓存，默认关闭，开启后有两个特性
    //     // 1. 所有的 DNS 查询都会默认优先使用缓存的，即使 DNS 查询错误也不影响应用
    //     // 2. 对同一个域名，在 dnsCacheLookupInterval 的间隔内（默认 10s）只会查询一次
    //     enableDNSCache: false,
    //     // 对同一个域名进行 DNS 查询的最小间隔时间
    //     dnsCacheLookupInterval: 10000,
    //     // DNS 同时缓存的最大域名数量，默认 1000
    //     dnsCacheMaxLength: 1000,
    //
    //     request: {
    //         // 默认 request 超时时间
    //         timeout: 3000,
    //     },
    //
    //     httpAgent: {
    //         // 默认开启 http KeepAlive 功能
    //         keepAlive: true,
    //         // 空闲的 KeepAlive socket 最长可以存活 4 秒
    //         freeSocketKeepAliveTimeout: 4000,
    //         // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
    //         timeout: 30000,
    //         // 允许创建的最大 socket 数
    //         maxSockets: Number.MAX_SAFE_INTEGER,
    //         // 最大空闲 socket 数
    //         maxFreeSockets: 256,
    //     },
    //
    //     httpsAgent: {
    //         // 默认开启 https KeepAlive 功能
    //         keepAlive: true,
    //         // 空闲的 KeepAlive socket 最长可以存活 4 秒
    //         freeSocketKeepAliveTimeout: 4000,
    //         // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
    //         timeout: 30000,
    //         // 允许创建的最大 socket 数
    //         maxSockets: Number.MAX_SAFE_INTEGER,
    //         // 最大空闲 socket 数
    //         maxFreeSockets: 256,
    //     },
    // }
  };


  config.onerror = {
    json(err, ctx) {
      // 未捕获的异常

      // 在此处定义针对所有响应类型的错误处理方法
      // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
      let errcode = 500000;
      ctx.body = {errcode, errmsg: ctx.__(errcode), stack: ctx.app.env !== 'prod' ? err.stack : undefined};   // 非正式环境返回 stack 信息
      ctx.status = 500;
    },
  }
  return config;
};
