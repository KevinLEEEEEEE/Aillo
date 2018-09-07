const Nightmare = require('nightmare');
const assert = require('assert');

describe('imageDisplayAndConvert', () => {
  describe('imageDisplay', () => {
    it('unable to click when started', () => {
      const nightmare = Nightmare({ show: true });

      nightmare
        .goto('http://localhost:8080/')
        .type('#rename', 'testName')
        .evaluate(() => document.getElementById('rename').value)
        .end()
        .then((value) => {
          assert.equal(value, 'testName');
        })
        .catch((error) => {
          console.error('Search failed:', error);
        });
    });
  });
});
