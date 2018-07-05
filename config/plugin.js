'use strict';
const path= require('path');
// add you build-in plugin here, example:
// exports.nunjucks = {
//   enable: true,
//   package: 'egg-view-nunjucks',
// };


exports.validate = {
  enable: false,
  package: 'egg-validate',
};

exports.sequelize = {
  enable: false,
  package: 'egg-sequelize',
};
exports.tracer = {
  enable: true,
  package: 'egg-tracer',
};
exports.static = {
  enable: false
};

exports.i18n = { // enable by default
  enable: false
};

exports.session = { // enable by default
  enable: false
};


exports.ri18n= {
  enable: true,
  path: path.join(__dirname,'../lib/plugin/egg-ri18n'),
  // package: '',
};

exports.routerPlus = {
  enable: true,
  package: 'egg-router-plus',
};
