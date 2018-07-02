'use strict';

const uuid = require('uuid');

module.exports = app => {
  app.httpclient.on('request', req => {
    if (!req.ctx) {
      // auto set anonymous context
      req.ctx = req.args.ctx = app.createAnonymousContext();
      req.ctx.traceId = 'anonymous-' + uuid.v1();
    }
    // set tracer id
    if (!req.ctx.traceId) {
      req.ctx.traceId = uuid.v1();
    }
    req.starttime = Date.now();
    req.args.headers = req.args.headers || {};
    req.args.headers['x-request-id'] = req.ctx.traceId;
    req.args.method = req.args.method || 'GET';
    app.logger.info('[httpclient] [%s] %s %s , [[start]], req_args: %s',
      req.ctx.traceId, req.args.method, req.url,
      JSON.stringify(req.args.data)
    );
  });

  // 文档都在：https://www.tapd.cn/20392041/markdown_wikis/view/#1120392041001001899
  app.httpclient.on('response', result => {
    const req = result.req;
    const res = result.res;
    
    app.logger.info('[httpclient] [%s] %s %s [[end]], status: %s, use: %s, response: %s',
      req.ctx.traceId, req.args.method, req.url,
      res.status, Date.now() - req.starttime,
      JSON.stringify(res.data)
    );

    /**
     * 后端崩了, 其实直接进入了 rain-egg-frame/config/config.default.js 中的 config.onerror 进行处理
     * 这里这么写是兜底
     */
    if (result.error !== null) {
      app.logger.info('[res.error !== null] [httpclient] [%s] %s %s [[end]], status: %s',
        req.ctx.traceId, req.args.method, req.url,
        res.status
      );
      res.data = 'replace-html-parse-error'
      return result.ctx.status = 500;
    }

    /**
     * 操作类错误
     */
    if (res.data.errcode !== 0) {
      app.logger.info('[res.data.errcode !== 0] [httpclient] [%s] %s %s [[end]], status: %s',
        req.ctx.traceId, req.args.method, req.url,
        res.status
      );

      // 让整个请求的 status 为本 errorcode 类型
      result.ctx.status = res.data.errcode;
      return result.ctx.body = {errcode: res.data.errcode, errmsg: res.data.errmsg}
    }

    // 没有错误
    // 未考虑并发请求，并发请求的话后面覆盖 ctx.body 即可
    result.ctx.body = res.data.data
  });
};
