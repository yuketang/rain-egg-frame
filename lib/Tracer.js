'use strict';
const Tracer = require('egg-tracer');

const uuid = require('uuid');

const TRACE_ID = Symbol('traceId');

class MyTracer extends Tracer {
  get traceId() {
    this[TRACE_ID] = this[TRACE_ID] || this.ctx.get('x-request-id') || uuid.v1();
    return this[TRACE_ID];
  }
}

module.exports = MyTracer;
