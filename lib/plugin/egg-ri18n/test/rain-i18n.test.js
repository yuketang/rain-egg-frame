'use strict';

const mock = require('egg-mock');

describe('test/ri18n.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/ri18n-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, ri18n')
      .expect(200);
  });
});
