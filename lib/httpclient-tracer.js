'use strict';

const uuid = require('uuid');
/**
 * 计算响应时间
 * @param {Array} startedAt 请求时间
 * @return {string} 响应时间字符串
 */
function calcResponseTime(startedAt) {
  const diff = process.hrtime(startedAt);
  // 秒和纳秒换算为毫秒,并保留3位小数
  return (diff[ 0 ] * 1e3 + diff[ 1 ] * 1e-6).toFixed(3);
}

module.exports = app => {

  app.httpclient.on('request', req => {

    req.trace_id = req.trace_id || uuid.v1();   // 对于某一个接口，node可能会向python同时发起多个请求，trace_id用以区别
    req._startTime = process.hrtime();
    req.args.headers = req.args.headers || {};
    req.args.method = req.args.method || 'GET';
    req.args.data = req.args.data ||{};
    req.args.data.req_id = req.ctx.req_id;

    let reqFields = {
      trace_id: req.trace_id,
      url: req.url,
      path: req.url.replace(/\?.*/, '').replace(/\/+$/g, ""),
      method: req.args.method,
      body: JSON.stringify(req.args.data).substring(0, 500),
      uid: req.ctx.session ? req.ctx.session.user_id : undefined,
    };

    if(req.ctx.log) {
      req.log = req.ctx.log.child(reqFields)
      req.log.info('Send request to third');
    }
  });

  // 文档都在：https://www.tapd.cn/20392041/markdown_wikis/view/#1120392041001001899
  app.httpclient.on('response', result=> {
    const req = result.req;
    const res = result.res;

    let resFields = {
      response: JSON.stringify(res.data || 'whathef').substring(0,300),
      cost: calcResponseTime(req._startTime),
      http_status_code: res.status,
    };

    req.log && req.log.child(resFields).info('Receive from third');

    if(app.config.httpclientHandleRes){

      /**
       * 后端崩了, 其实直接进入了 rain-egg-frame/config/config.default.js 中的 config.onerror 进行处理
       * 这里这么写是兜底
       */
      if (result.error !== null) {
        req.log && req.log.child(resFields).error('[res.error !== null] ');

        res.data = 'replace-html-parse-error';
        return result.ctx.status = 500;
      }

      /**
       * 操作类错误
       * res.data.status 是 Node 的接口（实验 评论）
       * res.data.code 是新后端的接口的规则
       */
      if (res.data.code !== 0 && res.data.errcode !== 0 && res.data.status !== 0) {
        req.log && req.log.child(resFields).error('[res.data.errcode !== 0 || res.data.status !== 0] ');

        return result.ctx.body = {errcode: res.data.errcode || res.data.status || res.data.code, errmsg: res.data.errmsg || res.data.msg}
      }

      // 为了兼容外部的代码，到这的是成功的，设res.data.errcode 为 0
      res.data.errcode = 0

      /**
       * 没有错误时的处理（主要是为了非并发请求，在这里直接有返回值）
       * 对后端的请求，让后面的覆盖前面的，主要应对中间件有请求的情况，
       * 如 controller.classroom.fetchClassroom 路由前加了 sessionPro 中间件的处理，
       * 该中间件中有对后端的请求发生
       *
       * 并发请求组合数据的话，后面的请求的返回会反复覆盖之前的，不用管，在 controller 中又会再次用最终结果进行覆盖，在 controller 中覆盖 ctx.body 即可
       *
       * 注意：
       * 如果是同一个前端请求导致的并发请求后端的话， 他们的 ctx 为同一个实例
       * 如果这些并发的返回中有了个错误，就不能让后到的接口的正常返回覆盖了那个错误的errcode
       *
       * 初始，result.ctx.body 为 undefined
       */
      // if (!result.ctx.body || result.ctx.body.errcode === 0) {
      // 加这个if的话，中间件返回值会劫持后续处理的返回值


      // Node 的评论点赞接口有可能根本没有 res.data.data 如: {"status": 0, "message": "正确"}
      result.ctx.body = res.data.data || {}
      // }
    }else{
      return result;
    }

  });
};
