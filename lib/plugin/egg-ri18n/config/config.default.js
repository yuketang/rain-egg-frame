'use strict';

/**
 * egg-ri18n default config
 * @member Config#ri18n
 * @property {String} SOME_KEY - some description
 */

const path = require('path');

exports.ri18n = {
  defaultLocale: 'en',
  queryField: 'locale',
  headerField: 'X-Language',
  localeAlias: {},
  dir: undefined,
  dirs: [ path.join(process.cwd(), 'locales') ],
  functionName: '__',
};
