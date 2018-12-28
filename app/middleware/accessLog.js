const path = require('path');
const util = require('util');
const uuid = require('uuid');

module.exports = options => {
    return async function access_log(ctx, next) {
      const start = Date.now();
        ctx.traceId = uuid.v1();
        await next();

        const rs = Math.ceil(Date.now() - start);

        ctx.set('X-Response-Time', rs);
        const skipExt = '';
        const ext = path.extname(ctx.url).toLocaleLowerCase();
        const isSkip = skipExt.indexOf(ext) !== -1 && ctx.status < 400;

        if (!isSkip) {
            const ip = ctx.ip;
            const protocol = ctx.protocol.toUpperCase();
            const response = JSON.stringify(ctx.body);
            const query = JSON.stringify(ctx.request.query);
            const body = JSON.stringify(ctx.request.body);
            const request = JSON.stringify(Object.assign({}, query, body));
            const method = ctx.method;
            const url = ctx.url;
            const status = ctx.status;
            const length = ctx.length || '-';
            const referrer = ctx.get('referrer') || '-';
            const ua = ctx.get('user-agent') || '-';
            const serverTime = ctx.response.get('X-Server-Response-Time') || '-';
            const message = util.format('[access] %s %s %s %s %s %sms %sbytes %s %s %s %s %s',
                ip, method, protocol, status, url, rs, length, request, response, referrer, serverTime, ua);
            ctx.accessLogger.info(message);
        }
    };
};

