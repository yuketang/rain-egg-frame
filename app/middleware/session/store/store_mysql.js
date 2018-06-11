'use strict';

const Sequelize = require('sequelize');


class Store {
  constructor(options, app) {
    this.session_table = options.session_table;
    this.app = app;
    this.sequelize = new Sequelize(options.DATABASE, options.USER, options.PASSWORD, {
      host: options.HOST,
      dialect: 'mysql',       //数据库类型
      timezone: '+08:00',
      logging: false,
      operatorsAliases: false,	//不然会有一行提示信息
      pool: {
        max: 10,
        min: 0,
        idle: 10000
      }
    });
  }

  async get(sid) {
    let {sequelize} = this;

    this.sql = `select * from ${this.session_table} where session_key='${sid}'`;
    try {
      let result = (await sequelize.query(this.sql, {type: Sequelize.QueryTypes.SELECT}))[0];
      return result || {};
    } catch (e) {
      throw e;
    }

  }
}


module.exports = Store;

