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
  app.httpclient.on('response', result=> {
    const req = result.req;
    const res = result.res;

    app.logger.info('[httpclient] [%s] %s %s %s [[end]], status: %s, use: %s, response: %s',
      req.ctx.traceId, req.args.method, req.url,result.ctx.body,
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
     * res.data.status 是 Node 的接口（实验 评论）
     */
    if (res.data.errcode !== 0 && res.data.status !== 0) {
      app.logger.info('[res.data.errcode !== 0 || res.data.status !== 0] [httpclient] [%s] %s %s [[end]], status: %s',
        req.ctx.traceId, req.args.method, req.url,
        res.status
      );

      return result.ctx.body = {errcode: res.data.errcode || res.data.status, errmsg: res.data.errmsg}
    }

    /**
     * 没有错误时的处理（主要是为了非并发请求，在这里直接有返回值）
     * 并发请求组合数据的话，在 controller 中覆盖 ctx.body 即可
     *
     * 注意：
     * 如果是同一个前端请求导致的并发请求后端的话， 他们的 ctx 为同一个实例
     * 如果这些并发的返回中有了个错误，就不能让后到的接口的正常返回覆盖了那个错误的errcode
     *
     * 初始，result.ctx.body 为 undefined
     */
    if (!result.ctx.body || result.ctx.body.errcode === 0) {
      // 并发情况下，后面的请求的返回会反复覆盖之前的，不用管，在 controller 中又会再次用最终结果进行覆盖
      // Node 的评论点赞接口有可能根本没有 res.data.data 如: {"status": 0, "message": "正确"}
      result.ctx.body = res.data.data || {}
    }
  });
};
