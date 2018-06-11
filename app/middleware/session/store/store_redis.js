'use strict';

/**
 * Module dependencies.
 * @private
 */

var Redis = require('ioredis')

class Store {
  constructor(options, app) {
    this.store = new Redis.Cluster(options);
    this.app = app;
  }

  async get(sid) {
    let {sequelize} = this;

    try {
      let result = await this.store.get(sid);

      if (result) return {session_key: sid, session_data: result, expire_date: 0}
      return {};
    } catch (e) {
      throw e;
    }
  }
}

module.exports = Store;
