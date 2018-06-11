const util = require('util');

module.exports = app => {
    /**
     * 全局定义  __fmt  方法
     %s - String.
     %d - Number (integer or floating point value).
     %i - Integer.
     %f - Floating point value.
     %j - JSON. Replaced with the string '[Circular]' if the argument contains circular references.
     %o - Object. A string representation of an object with generic JavaScript object formatting. Similar to util.inspect() with options { showHidden: true, depth: 4, showProxy: true }. This will show the full object including non-enumerable symbols and properties.
     %O - Object. A string representation of an object with generic JavaScript object formatting. Similar to util.inspect() without options. This will show the full object not including non-enumerable symbols and properties.
     %% - single percent sign ('%'). This does not consume an argument.
     * @private
     */

    global.__fmt = util.format;

    /**
     * 对对象数组进行排序
     * todo: 添加到 Array上
     * @param fields  ['id,-1', 'time,-1']  先按id倒序，再按time倒序  （默认是倒序）
     */
    global.__sort = function (arr_obj, fields) {
        return arr_obj.sort((pre, next) => {
            let cps = [];

            if (fields.length < 1) {
                for (let p in pre) {
                    if (pre[p] > next[p]) {
                        cps.push(1);
                        break; // 大于时跳出循环。
                    } else if (pre[p] === next[p]) {
                        cps.push(0);
                    } else {
                        cps.push(-1);
                        break; // 小于时跳出循环。
                    }
                }
            } else {
                for (let i = 0; i < fields.length; i++) {
                    let [field, order = -1] = fields[i].split(',');
                    if (pre[field] > next[field]) {
                        cps.push(order != -1 ? 1 : -1);
                        break; // 大于时跳出循环。
                    } else if (pre[field] === next[field]) {
                        cps.push(0);
                    } else {
                        cps.push(order != -1 ? -1 : 1);
                        break; // 小于时跳出循环。
                    }
                }
            }

            for (let j = 0; j < cps.length; j++) {
                if (cps[j] === 1 || cps[j] === -1) {
                    return cps[j];
                }
            }
            return 0;
        });
    };

    require('./lib/httpclient-tracer')(app);


};
