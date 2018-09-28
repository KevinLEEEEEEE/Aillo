import histogramController from './api/histogramController';
import histogramManager from './api/histogramManager';
import GlobalExp2 from './Global_exp2';

const MAXSTEP = 256;
const MAXPOINT = 5;
const WIDTH = 256;
const HEIGHT = 256;

const _ = {
  init(myHistogram, myController, stepInput) {
    myHistogram.canvas.setFillStyle(160, 160, 160);

    myController.canvas.setFillStyle(255, 255, 255)
      .setStrokeStyle(255, 255, 255);

    myController.setRadius(3);

    this.stepInput = stepInput;
    this.myHistogram = myHistogram;
    this.myController = myController;
  },

  // --------------------------------------------------------------

  resetController() {
    this.myController.reset();
  },

  updateController(isCurve) {
    if (isCurve === true) {
      _.changeToCurve();
    } else {
      _.changeToLine();
    }

    return this;
  },

  // --------------------------------------------------------------

  changeToLine() {
    this.myController.empty()
      .drawLine();
  },

  changeToCurve() {
    this.myController.empty()
      .drawCurve();
  },

  // --------------------------------------------------------------

  getHistogram() {
    return this.myHistogram.getHistogram();
  },

  updateHistogram(data, isCurve) {
    let mappedData = null;

    if (isCurve === true) {
      mappedData = this.myController.mapCurve(data);
    } else {
      mappedData = this.myController.mapLine(data);
    }

    const histogramData = this.myHistogram.initHistogram(mappedData);

    this.myHistogram.drawHistogram(histogramData);

    return this;
  },

  // --------------------------------------------------------------

  updateImage() {
    return this;
  },
};

export default function histogram() {
  const equalizationBtn = document.getElementById('equalization');
  const histogramBtn = document.getElementById('histogram');
  const transBtn = document.getElementById('trans');
  const histogramCanvas = document.getElementById('histogramCanvas');
  const controllerCanvas = document.getElementById('curveCanvas');
  const stepInput = document.getElementById('step');

  const myHistogram = histogramManager(histogramCanvas, WIDTH, HEIGHT);
  const myController = histogramController(controllerCanvas, WIDTH, HEIGHT);

  _.init(myHistogram, myController, stepInput);


  let storage = null;
  let lastPos = [];
  let movePointIndex = -1;
  let pointCount = 0;
  let canMove = false;
  let isCurve = false;

  const update = () => {
    storage = GlobalExp2.getColorData();

    const step = stepInput.value || 256;

    const data = myHistogram.setStep(step)
      .initHistogram(storage.data);

    myHistogram.drawHistogram(data);

    _.resetController();
  };

  equalizationBtn.addEventListener('click', () => {

  });

  histogramBtn.addEventListener('click', () => {
    _.resetController();
    update();
  });

  transBtn.addEventListener('click', () => {
    isCurve = !isCurve;

    _.updateController(isCurve);
  });

  controllerCanvas.addEventListener('mousedown', (e) => {
    const { layerX, layerY, button } = e;
    const point = [layerX, layerY];

    if (isCurve === true) {
      movePointIndex = 1;
      lastPos = point;
      canMove = true;

      myController.moveCurvePoint(movePointIndex, point, true);
    } else {
      const cloestIndex = myController.getClosestPoint(point);

      if (button === 0 && cloestIndex === -1) { // add
        if (pointCount < MAXPOINT) {
          myController.addLinePoint(point, true);
          pointCount += 1;
        }
      } else if (button === 0 && cloestIndex !== -1) { // move
        movePointIndex = cloestIndex;
        lastPos = point;
        canMove = true;
      } else if (button === 2 && cloestIndex !== -1) { // remove
        myController.removeLinePoint(cloestIndex, true);
        pointCount -= 1;
      }
    }
  });

  controllerCanvas.addEventListener('mousemove', (e) => {

  });

  controllerCanvas.addEventListener('mouseup', () => {
    _.updateHistogram(storage.data, isCurve);
  });

  controllerCanvas.addEventListener('mouseleave', () => {
    // _.updateHistogram(isCurve);
  });

  controllerCanvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  return update;
}
