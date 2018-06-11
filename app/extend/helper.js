module.exports = {
  formatError(errcode = 0, data = []) {
    return { errcode, errmsg: this.ctx.__(errcode, ...data) };
  },
};
