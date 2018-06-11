'use strict';
const assert = require('assert')

module.exports = {
    get accessLogger() {
        return this.getLogger('accessLogger')
    },

    // get tracer() {
    //     if (!this.__tracer) {
    //         this.__tracer = new this.app.config.tracelog.Tracer(this);
    //     }
    //     return this.__tracer;
    // },
    success (data) {
        this.body = {
            ...this.helper.formatError(),
            data
        }
    },

    fail: (errcode = -1, status, data) => {
        assert(errcode !== -1, 'Please set errcode!!!')

        this.status = status;
        this.body = {
            ...this.helper.formatError(errcode),
            data
        }
    }
};
