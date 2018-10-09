
const prop = {
  redo() {
    const gap = this.maxStep - this.history.length;

    this.undoChance = this.undoChance - gap + 1;
    this.redo -= 1;
  },

  undo() {
    // const index = this.currentStep % this.maxStep;

    const gap = this.maxStep - this.history.length;

    this.undoChance = this.undoChance - gap - 1;
    this.redo += 1;

    // return this.history[index];
  },

  do(imageData) {
    // const index = this.currentStep % this.maxStep;

    // this.history[index] = imageData;
    const gap = this.maxStep - this.history.length;

    this.currentStep += 1;
    this.undoChance = this.undoChance - gap - this.redoChance + 1;
    this.redoChance = 0;

    return this;
  },

  canRedo() {
    return this.redoChance > 0;
  },

  canUndo() {
    const gap = this.maxStep - this.history.length;

    return this.undoChance - gap > 0;
  },
};

export default function history(maxStep) {
  const myHistory = Object.create(prop);

  myHistory.history = [];
  myHistory.maxStep = maxStep;
  myHistory.currentStep = -1;
  myHistory.undoChance = 5;
  myHistory.redoChance = 0;

  return myHistory;
}
