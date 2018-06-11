/**
 * 1. siteFile 在app.js中是删不掉的
 *   // 将 siteFile 中间件删除
      const index = app.config.coreMiddleware.indexOf('siteFile');
      app.config.coreMiddleware.splice(index, 1);
 * 2. todo: 前端遇500需要提供合理的提示，同时要上报
 * 3. next(500001)并不会进onerror,会正常往下走
 *    要进 onerror 需要使用 ctx.throw()
 *
 *
 * */
