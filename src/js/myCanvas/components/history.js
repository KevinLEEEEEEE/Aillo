
const prop = {
  redo() {
    if (!this.canRedo()) {
      throw new Error('cannot redo anymore');
    }

    this.currentStep += 1;
    this.undoChance += 1;
    this.redoChance -= 1;

    return this.history[this.currentStep % this.maxStep];
  },

  undo() {
    if (!this.canUndo()) {
      throw new Error('cannot undo anymore');
    }

    this.currentStep -= 1;
    this.undoChance -= 1;
    this.redoChance += 1;

    return this.history[(this.currentStep + 1) % this.maxStep];
  },

  do(imageData) {
    const gap = this.maxStep - this.history.length;

    this.currentStep += 1;
    this.undoChance = this.maxStep - gap - this.redoChance - 1;
    this.redoChance = 0;

    this.history[this.currentStep % this.maxStep] = imageData;

    return this;
  },

  canRedo() {
    return this.redoChance > 0;
  },

  canUndo() {
    const gap = this.maxStep - this.history.length;

    return this.maxStep - gap - this.redoChance - 1 > 0;
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
