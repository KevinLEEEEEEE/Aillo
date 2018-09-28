import GlobalExp2 from './Global_exp2';

const MAXSTEP = 256;
const MAXPOINT = 5;
const CANVASW = 256;
const CANVASH = 256;
const DISTANCE = 10;

const _ = {
  init(hcanvas, ccanvas) {
    const histogramContext = hcanvas.getContext('2d');
    const adjustContext = ccanvas.getContext('2d');

    hcanvas.style.width = CANVASW;
    hcanvas.style.height = CANVASH;
    ccanvas.style.width = CANVASW;
    ccanvas.style.height = CANVASH;

    hcanvas.width = CANVASW;
    hcanvas.height = CANVASH;
    ccanvas.width = CANVASW;
    ccanvas.height = CANVASH;

    histogramContext.fillStyle = 'rgb(160, 160, 160)';

    adjustContext.lineWidth = 0.5;
    adjustContext.strokeStyle = 'rgba(255, 255, 255)';
    adjustContext.fillStyle = 'rgb(255, 255, 255)';

    return {
      histogramContext,
      adjustContext,
    };
  },

  getHistogram(data, step) {
    const tmp = [];
    const gap = MAXSTEP / step;

    for (let i = 0; i < step; i += 1) {
      tmp[i] = 0;
    }

    for (let i = 0, j = data.length; i < j; i += 1) {
      const targetStep = Math.floor(data[i] / gap);

      tmp[targetStep] += 1;
    }

    return tmp;
  },

  mapHistogramL(data, linePoints) {
    const points = linePoints.map(value => this.getFunctionPoint(value));

    return data.map((value) => {
      let newVal = 0;

      for (let i = 0, j = points.length; i < j; i += 1) {
        if (value < points[i][0]) {
          const p1 = points[i - 1];
          const p2 = points[i];
          const k = (p2[1] - p1[1]) / (p2[0] - p1[0]);
          newVal = (value - p1[0]) * k + p1[1];
          break;
        }
      }

      return newVal;
    });
  },

  mapHistogramC(data, curvePoints) {
    const curveFunction = this.getCurveFunction(curvePoints[1]);

    return data.map(value => curveFunction(value));
  },


  mapHistogramE(data, lut) {
    return data.map(val => lut[val]);
  },

  drawHistogramOnCanvas(data, context) {
    const step = data.length;
    const max = Math.round(Math.max(...data) / 0.8);

    context.clearRect(0, 0, CANVASW, CANVASH);

    for (let i = 0; i < step; i += 1) {
      const height = Math.round(data[i] * CANVASH / max);
      const width = CANVASW / step;
      const x = i * width;
      const y = CANVASH - height;

      context.fillRect(x, y, width, height);
    }
  },

  getFunctionPoint([x, y]) {
    return [x, CANVASH - y];
  },

  drawlinePointsOnCanvas(points, context) {
    context.clearRect(0, 0, CANVASW, CANVASH);

    for (let i = 0, j = points.length - 1; i < j; i += 1) {
      this.drawLine(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], context);
      if (i < j - 1) {
        this.drawCircle(points[i + 1][0], points[i + 1][1], 3, context);
      }
    }
  },

  getCurveFunction([x, y]) {
    const a = Math.E ** (Math.log(x / CANVASW) / (y / CANVASH - 1));
    return (x1) => {
      const result = Math.log(x1 / CANVASW) / Math.log(a) + 1;

      return result >= 0 ? result * CANVASH : 0;
    };
  },

  drawCurvePointsOnCanvas(points, context) {
    const midPoint = points[1];
    const midFunctionPoint = this.getFunctionPoint(midPoint);
    const curveFunction = this.getCurveFunction(midFunctionPoint);

    this.clear(context);

    context.beginPath();

    for (let x = 0; x < CANVASW; x += 1) {
      const y = curveFunction(x);
      context.fillRect(x, CANVASH - y, 1, 1);
    }

    context.closePath();

    this.drawCircle(midPoint[0], midPoint[1], 3, context);
  },

  clear(context) {
    context.clearRect(0, 0, CANVASW, CANVASH);
  },

  drawLine(x1, y1, x2, y2, context) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
  },

  drawCircle(x, y, radius, context) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  },

  getDistance([x1, y1], [x2, y2]) {
    return Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2));
  },

  getClosestPoint(point, linePoints) {
    const distance = [];

    for (let i = 0, j = linePoints.length; i < j; i += 1) {
      distance.push(this.getDistance(point, linePoints[i]));
    }

    const min = Math.min(...distance);
    const index = distance.indexOf(min);

    if (min > DISTANCE || index === 0 || index === linePoints.length - 1) {
      return -1;
    }

    return index;
  },

  equalization(histogramData, amount, step) {
    const probability = histogramData.map(value => value / amount);
    const probabilityAccu = [];

    probabilityAccu.push(probability[0]);
    probability.reduce((accu, current) => {
      const val = accu + current;

      probabilityAccu.push(val);

      return val;
    });

    const lut = probabilityAccu.map((value) => {
      let val = 0;

      for (let i = 1; i <= step; i += 1) {
        const right = i === step ? 1 : i / (step - 1);

        if (value <= right) {
          const left = i === 1 ? 1 : (i - 1) / (step - 1);
          val = right - value >= value - left ? i - 1 : i;
          break;
        }
      }

      return val;
    });

    const accuLut = {};

    for (let i = 0; i < lut.length; i += 1) {
      const target = lut[i];
      for (let j = 0; j < lut.length; j += 1) {
        if (target === lut[j]) {
          if (!Reflect.has(accuLut, target)) {
            accuLut[target] = new Set();
          }

          accuLut[target].add(j);
        }
      }
    }

    const accuHistogram = [];

    for (let i = 0; i < step; i += 1) {
      accuHistogram[i] = 0;
    }

    Object.keys(accuLut).forEach((value) => {
      let accu = 0;

      accuLut[value].forEach((val) => {
        accu += histogramData[val];
      });

      accuHistogram[value] = accu;
    });

    return { accuHistogram, lut };
  },
};

export default function histogram() {
  const histogramCanvas = document.getElementById('histogramCanvas');
  const equalization = document.getElementById('equalization');
  const curveCanvas = document.getElementById('curveCanvas');
  const histogramBtn = document.getElementById('histogram');
  const stepInput = document.getElementById('step');
  const transBtn = document.getElementById('trans');
  const context = _.init(histogramCanvas, curveCanvas);

  let storage = null;
  let lastPos = [];
  let movePointIndex = -1;
  let pointCount = 0;
  let canMove = false;
  let isCurve = false;
  let step = -1;
  let currentHistogram = null;

  let linePoints = [[0, CANVASH], [CANVASW, 0]];
  let curvePoints = [[0, CANVASH], [CANVASW / 2, CANVASH / 2 + 20], [CANVASW, 0]];

  const update = () => {
    storage = GlobalExp2.getColorData();
  };

  const updateImage = () => {
    let data = null;
    if (isCurve === true) {
      data = _.mapHistogramC(storage.data, curvePoints);
    } else {
      data = _.mapHistogramL(storage.data, linePoints);
    }

    currentHistogram = _.getHistogram(data, step);

    GlobalExp2.setColorData(data, 'jpeg');

    _.drawHistogramOnCanvas(currentHistogram, context.histogramContext);
  };

  const reset = () => {
    linePoints = [[0, CANVASH], [CANVASW, 0]];
    curvePoints = [[0, CANVASH], [CANVASW / 2, CANVASH / 2 + 20], [CANVASW, 0]];
    isCurve = false;
    _.drawlinePointsOnCanvas(linePoints, context.adjustContext);
  };

  equalization.addEventListener('click', () => {
    const equalData = _.equalization(currentHistogram, CANVASW * CANVASH, step);

    currentHistogram = equalData.accuHistogram;

    _.drawHistogramOnCanvas(currentHistogram, context.histogramContext);

    storage.data = _.mapHistogramE(storage.data, equalData.lut);

    GlobalExp2.setColorData(storage.data, 'jpeg');

    reset();
  });

  histogramBtn.addEventListener('click', () => {
    step = stepInput.value || 256;

    GlobalExp2.setColorData(storage.data);

    reset();

    currentHistogram = _.getHistogram(storage.data, step);

    _.drawHistogramOnCanvas(currentHistogram, context.histogramContext);
  });

  curveCanvas.addEventListener('mousedown', (e) => {
    if (storage === null) {
      return;
    }

    const { layerX, layerY, button } = e;
    const functionPoint = [layerX, layerY];

    if (isCurve === true) {
      curvePoints[1] = functionPoint;
      lastPos = functionPoint;
      movePointIndex = 1;
      canMove = true;

      _.drawCurvePointsOnCanvas(curvePoints, context.adjustContext);
      return;
    }

    const index = _.getClosestPoint(functionPoint, linePoints);

    if (index === -1 && button === 0) { // add new point
      for (let i = 0, j = linePoints.length; i < j; i += 1) {
        if (functionPoint[0] < linePoints[i][0]) {
          if (pointCount <= MAXPOINT) {
            linePoints.splice(i, 0, functionPoint);
            movePointIndex = i;
            pointCount += 1;
            lastPos = functionPoint;
            canMove = true;
          }
          break;
        }
      }

      _.drawlinePointsOnCanvas(linePoints, context.adjustContext);
    } else if (index !== -1 && button === 2) { // delete old point
      for (let i = 0, j = linePoints.length; i < j; i += 1) {
        if (functionPoint[0] < linePoints[i][0]) {
          linePoints.splice(i - 1, 1);
          pointCount -= 1;
          break;
        }
      }

      _.drawlinePointsOnCanvas(linePoints, context.adjustContext);
      updateImage();
    } else if (index !== -1) { // move point
      lastPos = functionPoint;
      movePointIndex = index;
      canMove = true;
    }
  });

  curveCanvas.addEventListener('mousemove', (e) => {
    if (storage === null) {
      return;
    }

    if (canMove === true && e.button === 0) {
      const { layerX, layerY } = e;
      const functionPoint = [layerX, layerY];
      const deltaX = lastPos[0] - functionPoint[0];
      const deltaY = lastPos[1] - functionPoint[1];
      const x = lastPos[0] - deltaX;
      const y = lastPos[1] - deltaY;
      const rBorder = isCurve ? curvePoints[2][0] : linePoints[movePointIndex + 1][0];
      const lBorder = isCurve ? curvePoints[0][0] : linePoints[movePointIndex - 1][0];

      if (x < rBorder && x > lBorder) {
        if (isCurve === false) {
          linePoints[movePointIndex] = [x, y];
          _.drawlinePointsOnCanvas(linePoints, context.adjustContext);
        } else {
          curvePoints[1] = [x, y];
          _.drawCurvePointsOnCanvas(curvePoints, context.adjustContext);
        }
      }
    }
  });

  curveCanvas.addEventListener('mouseup', () => {
    if (storage === null) {
      return;
    }

    if (canMove === true) {
      canMove = false;
      updateImage();
    }
  });

  curveCanvas.addEventListener('mouseleave', () => {
    if (storage === null) {
      return;
    }

    if (canMove === true) {
      canMove = false;
      updateImage();
    }
  });

  curveCanvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  transBtn.addEventListener('click', () => {
    isCurve = !isCurve;

    if (isCurve === true) {
      _.drawCurvePointsOnCanvas(curvePoints, context.adjustContext);
    } else {
      _.drawlinePointsOnCanvas(linePoints, context.adjustContext);
    }

    updateImage();
  });

  return update;
}
