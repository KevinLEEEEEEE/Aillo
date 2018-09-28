import canvasManager from './canvasManager';

const MAXSTEP = 256;

const prop = {
  init() {
    return this;
  },

  initHistogram(data) {
    const histogram = (new Array(Number(this.step))).fill(0);
    const gap = MAXSTEP / this.step;

    for (let i = 0, j = data.length; i < j; i += 1) {
      const targetStep = Math.round(data[i] / gap);

      histogram[targetStep] += 1;
    }

    return histogram;
  },

  // --------------------------------------------------------------

  getHistogram() {
    return this.histogram;
  },

  // --------------------------------------------------------------

  setStep(step) {
    this.step = step;

    return this;
  },

  setHistogram(data) {
    this.histogram = data.slice(0);

    return this;
  },

  // --------------------------------------------------------------

  drawHistogram(data, scale = 0.8) {
    const step = data.length;
    const max = Math.round(Math.max(...data) / scale);
    const w = this.width / step;

    console.log(w);

    this.canvas.empty();
    this.setHistogram(data);

    for (let i = 0; i < step; i += 1) {
      const h = Math.round(data[i] * this.height / max);
      const x = i * w;
      const y = this.height - h;

      this.canvas.drawSquare(x, y, w, h);
    }

    return this;
  },

  // --------------------------------------------------------------

  equalization() {
    return this;
  },

  // --------------------------------------------------------------

  empty() {
    this.canvas.empty();

    return this;
  },
};

export default function histogramManager(canvas, width, height) {
  const myHistogram = Object.create(prop);
  const myCanvas = canvasManager(canvas, width, height);

  myHistogram.canvas = myCanvas;
  myHistogram.width = width;
  myHistogram.height = height;
  myHistogram.step = MAXSTEP;
  myHistogram.histogram = [];

  return myHistogram.init();
}
