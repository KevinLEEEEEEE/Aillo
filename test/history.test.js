import history from '../src/js/myCanvas/components/history';

const assert = require('assert');

describe('history', () => {
  describe('do', () => {
    it('less than max steps', () => {
      const myHistory = history(5);

      myHistory.do(1)
        .do(2)
        .do(3);

      assert.deepEqual(myHistory.history, [1, 2, 3]);
    });

    it('equals max steps', () => {
      const myHistory = history(5);

      myHistory.do(1)
        .do(2)
        .do(3)
        .do(4)
        .do(5);

      assert.deepEqual(myHistory.history, [1, 2, 3, 4, 5]);
    });

    it('more than max steps', () => {
      const myHistory = history(5);

      myHistory.do(1)
        .do(2)
        .do(3)
        .do(4)
        .do(5)
        .do(6)
        .do(7);

      assert.deepEqual(myHistory.history, [6, 7, 3, 4, 5]);
    });
  });

  describe('undo', () => {
    it('less with simple undo', () => {
      const myHistory = history(5);

      myHistory.do(1)
        .do(2)
        .do(3);

      assert.deepEqual(myHistory.history, [1, 2, 3]);

      const undo1 = myHistory.undo();

      assert.deepEqual(myHistory.history, [1, 2, 3]);
      assert.equal(undo1, 3);
    });

    it('less with complex undo', () => {
      const myHistory = history(5);

      myHistory.do(1)
        .do(2)
        .do(3);

      assert.deepEqual(myHistory.history, [1, 2, 3]);

      const undo1 = myHistory.undo();
      const undo2 = myHistory.undo();

      assert.deepEqual(myHistory.history, [1, 2, 3]);
      assert.equal(undo1, 3);
      assert.equal(undo2, 2);

      myHistory.do(4)
        .do(5)
        .do(6);

      assert.deepEqual(myHistory.history, [1, 4, 5, 6]);
    });

    it('more with complex undo', () => {
      const myHistory = history(5);

      myHistory.do(1)
        .do(2)
        .do(3)
        .do(4)
        .do(5)
        .do(6);

      assert.deepEqual(myHistory.history, [6, 2, 3, 4, 5]);

      const undo1 = myHistory.undo();
      const undo2 = myHistory.undo();

      assert.deepEqual(myHistory.history, [6, 2, 3, 4, 5]);
      assert.equal(undo1, 6);
      assert.equal(undo2, 5);

      myHistory.do(7)
        .do(8)
        .do(9);

      assert.deepEqual(myHistory.history, [8, 9, 3, 4, 7]);
    });
  });

  describe('redo', () => {
    it('less with simple redo', () => {
      const myHistory = history(5);

      myHistory.do(1)
        .do(2)
        .do(3);

      assert.deepEqual(myHistory.history, [1, 2, 3]);

      const undo1 = myHistory.undo();

      assert.deepEqual(myHistory.history, [1, 2, 3]);
      assert.equal(undo1, 3);

      const redo1 = myHistory.redo();

      assert.deepEqual(myHistory.history, [1, 2, 3]);
      assert.equal(redo1, 3);

      myHistory.do(4);

      assert.deepEqual(myHistory.history, [1, 2, 3, 4]);
    });

    it('less with complex redo', () => {
      const myHistory = history(5);

      myHistory.do(1)
        .do(2)
        .do(3);

      assert.deepEqual(myHistory.history, [1, 2, 3]);

      const undo1 = myHistory.undo();
      const undo2 = myHistory.undo();

      assert.deepEqual(myHistory.history, [1, 2, 3]);
      assert.equal(undo1, 3);
      assert.equal(undo2, 2);

      const redo1 = myHistory.redo();
      const redo2 = myHistory.redo();

      assert.deepEqual(myHistory.history, [1, 2, 3]);
      assert.equal(redo1, 2);
      assert.equal(redo2, 3);

      myHistory.do(4);

      assert.deepEqual(myHistory.history, [1, 2, 3, 4]);
    });

    it('more with complex redo', () => {
      const myHistory = history(5);

      myHistory.do(1)
        .do(2)
        .do(3)
        .do(4)
        .do(5)
        .do(6);

      assert.deepEqual(myHistory.history, [6, 2, 3, 4, 5]);

      const undo1 = myHistory.undo();
      const undo2 = myHistory.undo();

      assert.deepEqual(myHistory.history, [6, 2, 3, 4, 5]);
      assert.equal(undo1, 6);
      assert.equal(undo2, 5);

      const redo1 = myHistory.redo();

      assert.deepEqual(myHistory.history, [6, 2, 3, 4, 5]);
      assert.equal(redo1, 5);

      myHistory.do(7);

      assert.deepEqual(myHistory.history, [7, 2, 3, 4, 5]);
    });
  });

  describe('can redo', () => {
    it('redo with nothing', () => {
      const myHistory = history(5);

      assert.equal(myHistory.canRedo(), false);
      assert.throws(() => myHistory.redo(), /cannot redo anymore/);
    });

    it('redo before undo', () => {
      const myHistory = history(5).do(1);

      assert.deepEqual(myHistory.history, [1]);

      assert.equal(myHistory.canRedo(), false);
      assert.throws(() => myHistory.redo(), /cannot redo anymore/);
    });

    it('redo more than undo', () => {
      const myHistory = history(5).do(1).do(2);

      assert.deepEqual(myHistory.history, [1, 2]);
      assert.equal(myHistory.canRedo(), false);

      assert.equal(myHistory.undo(), 2);

      assert.equal(myHistory.canRedo(), true);
      assert.equal(myHistory.redo(), 2);

      assert.equal(myHistory.canRedo(), false);
      assert.throws(() => myHistory.redo(), /cannot redo anymore/);
    });

    it('resort redo after do', () => {
      const myHistory = history(5).do(1).do(2);

      assert.deepEqual(myHistory.history, [1, 2]);
      assert.equal(myHistory.canRedo(), false);

      assert.equal(myHistory.undo(), 2);

      assert.equal(myHistory.canRedo(), true);

      myHistory.do(3);

      assert.equal(myHistory.canRedo(), false);
    });
  });

  describe('can undo', () => {
    it('undo with nothing', () => {
      const myHistory = history(5);

      assert.deepEqual(myHistory.history, []);

      assert.equal(myHistory.canUndo(), false);
      assert.throws(() => myHistory.undo(), /cannot undo anymore/);
    });

    it('undo with single value', () => {
      const myHistory = history(5).do(1);

      assert.deepEqual(myHistory.history, [1]);

      assert.equal(myHistory.canUndo(), false);
      assert.throws(() => myHistory.undo(), /cannot undo anymore/);
    });

    it('undo more than do', () => {
      const myHistory = history(5).do(1).do(2);

      assert.deepEqual(myHistory.history, [1, 2]);

      assert.equal(myHistory.canUndo(), true);
      assert.equal(myHistory.undo(), 2);

      assert.equal(myHistory.canUndo(), false);
      assert.throws(() => myHistory.undo(), /cannot undo anymore/);
    });
  });
});
