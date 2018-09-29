import histogramController from './api/histogramController';
import histogramManager from './api/histogramManager';
import GlobalExp2 from './Global_exp2';

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
    if (isCurve === true) {
      this.mappedData = this.myController.mapCurve(data);
    } else {
      this.mappedData = this.myController.mapLine(data);
    }

    const histogramData = this.myHistogram.initHistogram(this.mappedData);

    this.myHistogram.drawHistogram(histogramData);

    return this;
  },

  // --------------------------------------------------------------

  updateImage() {
    GlobalExp2.setColorData(this.mappedData, 'jpeg');

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

    _.updateController(isCurve)
      .updateHistogram(storage.data, isCurve)
      .updateImage();
  });

  controllerCanvas.addEventListener('mousedown', (e) => {
    const { layerX, layerY, button } = e;
    const pos = [layerX, layerY];

    if (isCurve === true) {
      movePointIndex = 1;
      lastPos = pos;
      canMove = true;

      myController.moveCurvePoint(movePointIndex, pos, true);
    } else {
      const cloestIndex = myController.getClosestPoint(pos);

      if (button === 0 && cloestIndex === -1) { // add
        if (pointCount < MAXPOINT) {
          movePointIndex = myController.addLinePoint(pos, true);
          pointCount += 1;
          lastPos = pos;
          canMove = true;
        }
      } else if (button === 0 && cloestIndex !== -1) { // move
        movePointIndex = cloestIndex;
        lastPos = pos;
        canMove = true;
      } else if (button === 2 && cloestIndex !== -1) { // remove
        myController.removeLinePoint(cloestIndex, true);
        pointCount -= 1;
      }
    }
  });

  controllerCanvas.addEventListener('mousemove', (e) => {
    if (canMove === true && e.button === 0) {
      const { layerX, layerY } = e;
      const pos = [layerX, layerY];
      const deltaX = lastPos[0] - pos[0];
      const deltaY = lastPos[1] - pos[1];
      const x = lastPos[0] - deltaX;
      const y = lastPos[1] - deltaY;

      if (myController.isBorder(movePointIndex, [x, y], isCurve) === true) {
        if (isCurve === true) {
          myController.moveCurvePoint(movePointIndex);
        } else {
          myController.moveLinePoint(movePointIndex, [x, y], true);
        }
      }
    }
  });

  controllerCanvas.addEventListener('mouseup', () => {
    canMove = false;
    _.updateHistogram(storage.data, isCurve)
      .updateImage();
  });

  controllerCanvas.addEventListener('mouseleave', () => {
    canMove = false;
    _.updateHistogram(storage.data, isCurve)
      .updateImage();
  });

  controllerCanvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  return update;
}
