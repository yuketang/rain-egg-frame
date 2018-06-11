
'use strict';

const locales = require('./lib/locales');
const fs = require('fs');
const path = require('path');
const debug = require('debug')('egg:plugin:ri18n');


module.exports = function(app) {

  app.config.ri18n.functionName = '__';

  /* istanbul ignore next */
  app.config.ri18n.dirs = Array.isArray(app.config.ri18n.dirs) ? app.config.ri18n.dirs : [];
  // 按 egg > 插件 > 框架 > 应用的顺序遍历 config/locale(config/locales) 目录，加载所有配置文件
  for (const unit of app.loader.getLoadUnits()) {
    const localePath = path.join(unit.path, 'config/locale');

    /**
     * 优先选择 `config/locale` 目录下的多语言文件
     * 避免 2 个目录同时存在时可能导致的冲突
     */
    if (fs.existsSync(localePath)) {
      app.config.ri18n.dirs.push(localePath);
    } else {
      app.config.ri18n.dirs.push(path.join(unit.path, 'config/locales'));
    }
  }

  debug('app.config.ri18n.dirs:', app.config.ri18n.dirs);

  locales(app, app.config.ri18n);

  /**
   * `ctx.__` 的别名。
   * @see {@link Context#__}
   * @method Context#gettext
   */
  app.context.gettext = app.context.__;


  // 自动加载 Middleware
  // 将 ri18n 中间件放到 bodyParser 之前
  const index_i18n = app.config.coreMiddleware.indexOf('i18n');
  app.config.coreMiddleware.splice(index_i18n, 1, 'ri18n');
};
