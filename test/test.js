const Nightmare = require('nightmare');
const assert = require('assert');

describe('imageDisplayAndConvert', () => {
  describe('imageDisplay', () => {
    it('unsupported format should be rejected', () => {
      const nightmare = Nightmare();

      nightmare
        .goto('../dist/index.html')
        .type('#rename', 'testName')
        // .evaluate(() => document.getElementById('rename').value)
        .then((value) => {
          // console.log(document.getElementById('rename').value);
          // assert.equal(value, 'testName');
        });
      // assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
