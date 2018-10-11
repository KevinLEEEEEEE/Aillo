
const prop = {
  redo() {
    if (!this.canRedo()) {
      if (this.currentPos === this.redoPos) {
        throw new Error('please undo something before redo');
      }
      throw new Error('cannot redo');
    }

    this.currentPos += 1;

    return this.history[this.currentIndex];
  },

  undo() {
    if (!this.canUndo()) {
      if (this.currentPos === -1) {
        throw new Error('please do something before undo');
      } else if (this.currentPos === 0) {
        throw new Error('no step to undo anymore');
      }
      throw new Error('cannot undo');
    }

    this.currentPos -= 1;

    return this.history[this.currentIndex];
  },

  do(imageData) {
    this.currentPos += 1;
    this.undoPos += 1;
    this.redoPos = this.currentPos;

    this.history[this.currentIndex] = imageData;

    return this;
  },

  canRedo() {
    return this.redoPos > this.currentPos;
  },

  canUndo() {
    return this.undoPos < this.currentPos && this.currentPos > 0;
  },
};

export default function history(maxStep) {
  const myHistory = Object.create(prop, {
    currentIndex: {
      get() {
        return this.currentPos % maxStep;
      },
    },
  });

  myHistory.history = [];
  myHistory.currentPos = -1;
  myHistory.undoPos = -1 - maxStep;
  myHistory.redoPos = -1;

  return myHistory;
}
