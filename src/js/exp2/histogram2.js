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

    return this;
  },

  // --------------------------------------------------------------

  resetController(isCurve) {
    this.myController.reset(isCurve);

    return this;
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

    return this;
  },

  changeToCurve() {
    this.myController.empty()
      .drawCurve();

    return this;
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

const calculateProbability = (array) => {
  const total = array.reduce((prev, current) => prev + current, 0);

  return array.map(value => value / total);
};

const calcReversedLut = (array) => {
  const rLut = [];

  array.forEach((value, index) => {
    if (!Reflect.has(rLut, value)) {
      rLut[value] = [];
    }

    rLut[value].push(index);
  });

  return rLut;
};

const calcTotal = array => array.reduce((prev, current) => {
  if (current !== null) {
    return prev + current;
  }
  return prev;
}, 0);

const haffmanSplitation = (array) => {
  const total = calcTotal(array);
  let curTotal = 0;
  let curDis = total;
  let splitIndex = -1;

  // console.log(`halfTotal: ${total}`);

  for (let i = 0; i < array.length; i += 1) {
    if (array[i] !== null) {
      curTotal += array[i];
      const curLeft = total - curTotal;

      const addDis = Math.abs(curTotal - curLeft);

      if (addDis < curDis) {
        curDis = addDis;

        splitIndex = i;
      }
    }
  }

  // console.log(`splitIndex: ${splitIndex}`);

  return splitIndex;
};

const haffmanCalc = (array, prevNum, haffmans) => {
  const indexs = [];

  array.forEach((number, index) => {
    if (number !== null && number !== undefined) {
      indexs.push(index);
    }
  });

  if (indexs.length === 0) {
    return;
  }

  if (indexs.length === 1) {
    haffmans[indexs[0]] = prevNum;

    return;
  }

  if (indexs.length === 2) {
    haffmans[indexs[0]] = `${prevNum}1`;
    haffmans[indexs[1]] = `${prevNum}0`;

    return;
  }

  const i = haffmanSplitation(array);
  const small = [];
  const large = [];

  for (let is = 0; is <= i; is += 1) {
    small[is] = array[is] ? array[is] : null;
    large[is] = null;
  }

  for (let is = i + 1; is < array.length; is += 1) {
    large[is] = array[is];
  }

  // console.log(small, large, array);

  haffmanCalc(small, `${prevNum}1`, haffmans);
  haffmanCalc(large, `${prevNum}0`, haffmans);
};

const haffman = (array) => {
  const haffmans = {};

  console.log('');
  console.log('原始数组：');

  array.forEach((number, index) => {
    if (number !== null && number !== undefined) {
      console.log(`色阶： ${index}   拥有像素点： ${number} 个`);
    }
  });

  console.log('');

  haffmanCalc(array, '', haffmans);

  console.log('计算后数组：');

  Object.keys(haffmans).forEach((key) => {
    console.log(`色阶： ${key}   的编码为： ${haffmans[key]}`);
  });

  console.log('');

  alert('按下F12 查看编码前后的信息');
};

export default function histogram() {
  const equalizationBtn = document.getElementById('equalization');
  const reStepBtn = document.getElementById('reStep');
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

  const update = () => { // reset histogram and controller adter image changing
    storage = GlobalExp2.getColorData();

    const step = stepInput.value || 256;

    _.resetController(isCurve);

    const data = myHistogram.setStep(step)
      .initHistogram(storage.data);

    myHistogram.drawHistogram(data);
  };

  equalizationBtn.addEventListener('click', () => {
    if (storage === null) {
      return;
    }

    const lut = myHistogram.equalize(storage.data.length);
    // const imageData = myHistogram.mapEqualize(storage.data, lut);

    haffman(lut);

    // storage = {
    //   data: imageData,
    //   width: storage.width,
    //   height: storage.height,
    // };

    // _.resetController(isCurve)
    //   .updateHistogram(storage.data, isCurve)
    //   .updateImage();
  });

  reStepBtn.addEventListener('click', () => {
    if (storage === null) {
      return;
    }

    const step = stepInput.value || 256;

    _.resetController(isCurve);

    const data = myHistogram.setStep(step)
      .initHistogram(storage.data);

    myHistogram.drawHistogram(data);

    GlobalExp2.setColorData(storage.data, 'jpeg');
  });

  transBtn.addEventListener('click', () => {
    if (storage === null) {
      return;
    }

    isCurve = !isCurve;

    _.updateController(isCurve)
      .updateHistogram(storage.data, isCurve)
      .updateImage();
  });

  controllerCanvas.addEventListener('mousedown', (e) => {
    if (storage === null) {
      return;
    }

    const { layerX, layerY, button } = e;
    const pos = [layerX, layerY];

    if (isCurve === true) {
      movePointIndex = 1; // only one curve point permitted
      lastPos = pos;
      canMove = true;

      myController.moveCurvePoint(movePointIndex, pos, true);
    } else {
      const cloestIndex = myController.getClosestPoint(pos);

      if (button === 0 && cloestIndex === -1) { // add moveable point
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
    if (storage === null) {
      return;
    }

    if (canMove === true && e.button === 0) {
      const { layerX, layerY } = e;
      const pos = [layerX, layerY];
      const deltaX = lastPos[0] - pos[0];
      const deltaY = lastPos[1] - pos[1];
      const x = lastPos[0] - deltaX;
      const y = lastPos[1] - deltaY;

      if (myController.isBorder(movePointIndex, [x, y], isCurve) === true) {
        if (isCurve === true) {
          myController.moveCurvePoint(movePointIndex, [x, y], true);
        } else {
          myController.moveLinePoint(movePointIndex, [x, y], true);
        }
      }
    }
  });

  controllerCanvas.addEventListener('mouseup', () => {
    if (storage === null) {
      return;
    }

    canMove = false;
    _.updateHistogram(storage.data, isCurve)
      .updateImage();
  });

  controllerCanvas.addEventListener('mouseleave', () => {
    if (storage === null) {
      return;
    }

    canMove = false;
    _.updateHistogram(storage.data, isCurve)
      .updateImage();
  });

  controllerCanvas.addEventListener('contextmenu', (e) => {
    canMove = false;
    e.preventDefault();
  });

  return update;
}
