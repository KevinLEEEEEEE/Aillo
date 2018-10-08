
const prop = {
  stepForward(imageData) {
    const index = (this.currentStep + 1) % this.maxStep;

    this.history[index] = imageData;

    this.currentStep += 1;

    return this;
  },

  stepBack() {
    const index = (this.currentStep + 1) % this.maxStep;

    this.currentStep -= 1;

    return this.history[index];
  },
};

export default function history(maxStep) {
  const myHistory = Object.create(prop);

  myHistory.history = [];
  myHistory.maxStep = maxStep;
  myHistory.currentStep = -1;

  return myHistory;
}
