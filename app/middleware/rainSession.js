const Session = require('./session')

module.exports = (options, app) => {

  let session =  new Session(app, options);

  return async function session_check(ctx, next) {
    ctx.logger.info('================================= middleware.session_check')
    await session.session(ctx, next);
  };
};
