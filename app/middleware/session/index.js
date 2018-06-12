'use strict';

const RedisStore = require('./store/store_redis');
const MysqlStore = require('./store/store_mysql');
const debug = require('debug')('rain-session');
const cookie = require('cookie');
const signature = require('cookie-signature');

// session store can be a session store class
class Session {
  constructor(app,{redis, mysql, name = 'sessionid', path = '/'}) {

    this.app = app;
    this.name = name;
    this.name = name;
    this.path = path;
    this.store = redis ? new RedisStore(redis, app) : (mysql ? new MysqlStore(mysql, app) : '');

    if (mysql && !mysql.session_table) throw new Error('There is no session_table for session in mysql.');
    if (!this.store) throw new Error('There is no store_type for session .');

  }


  getSessionid() {
    let {ctx, name} = this;
    let header = ctx.headers.cookie, raw, val;
    debug('header', header)

    // read from cookie header
    if (header) {
      var cookies = cookie.parse(header);
      console.log('cookies', cookies)

      raw = cookies[name];
      console.log('raw', raw)
    }

    return raw || '';
  }


  async session(ctx, next) {

    let {store} = this;
    this.ctx = ctx;
    let sessionId = ctx.sessionID = ctx.sessionId = this.getSessionid();
    debug('sessionId', sessionId)

    // self-awareness
    if (ctx.session && ctx.session.user && ctx.session.user.user_id) {
      return next();
    } else {
      if (!sessionId) {
        ctx.status = 401
        return ctx.body = 401002;

      }

      try {

        let {session_key, session_data, expire_date} = await store.get(sessionId);

        // session不存在，
        if (!session_data || (expire_date <= new Date() && expire_date !== 0)) {
          debug('session不存在或已过期')
          ctx.status = 401
          return ctx.body = 401000;

        } else {
          debug('session found %j', session_data);
          ctx.session = JSON.parse(new Buffer(session_data, 'base64').toString().replace(/^\w{40}:/, ''))
          ctx.session.user_id = ctx.session._auth_user_id;
          ctx.session.origin_user_id = ctx.session._origin_user_id || ctx.session._auth_user_id;   //todo: 这里的user_id一定要整清楚
          ctx.session.system_user_id = ctx.session._system_user_id;
          ctx.session.language = ctx.session._language;
          debug('user_id, origin_user_id, system_user_id', ctx.session.user_id, ctx.session.origin_user_id, ctx.session.system_user_id)

          if (!ctx.session.user_id) {
            debug('session 错误')
            ctx.status = 401
            return ctx.body = 401001;
          }
        }
      } catch (err) {
        //  用await next(500000); 会按正常流程走；ctx.throw(500, 500000),onerror中拿不到500000
        //  遇到抛出err的情况，用ctx.throw，会在 config.onerror 中捕获并处理成500
        ctx.throw(err);
      }

      debug('session data', ctx.session)
      await next();
    }
  }


}

module.exports = Session;
