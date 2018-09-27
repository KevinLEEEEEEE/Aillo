import GlobalExp2 from './Global_exp2';

const MAXSTEP = 256;
const MAXPOINT = 5;
const CANVASW = 256;
const CANVASH = 256;
const DISTANCE = 10;

const _ = {
  init(hcanvas, ccanvas) {
    const hcontext = hcanvas.getContext('2d');
    const ccontext = ccanvas.getContext('2d');

    hcanvas.style.width = CANVASW;
    hcanvas.style.height = CANVASH;
    ccanvas.style.width = CANVASW;
    ccanvas.style.height = CANVASH;

    hcanvas.width = CANVASW;
    hcanvas.height = CANVASH;
    ccanvas.width = CANVASW;
    ccanvas.height = CANVASH;

    hcontext.fillStyle = 'rgb(160, 160, 160)';

    ccontext.lineWidth = 0.5;
    ccontext.strokeStyle = 'rgba(255, 255, 255)';
    ccontext.fillStyle = 'rgb(255, 255, 255)';

    return {
      hcontext,
      ccontext,
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

  mapHistogram(data, functionPoints) {
    const points = functionPoints.map(value => this.getFunctionPoint(value));

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

  drawFunctionPointsOnCanvas(points, context) {
    context.clearRect(0, 0, CANVASW, CANVASH);

    for (let i = 0, j = points.length - 1; i < j; i += 1) {
      this.drawLine(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], context);
      if (i < j - 1) {
        this.drawCircle(points[i + 1][0], points[i + 1][1], 3, context);
      }
    }
  },

  drawLine(x1, y1, x2, y2, context) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.stroke();
  },

  drawCircle(x, y, radius, context) {
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
  },

  drawCurve(x, y, context) {

  },

  getDistance([x1, y1], [x2, y2]) {
    return Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2));
  },

  getClosestPoint(point, functionPoints) {
    const distance = [];

    for (let i = 0, j = functionPoints.length; i < j; i += 1) {
      distance.push(this.getDistance(point, functionPoints[i]));
    }

    const min = Math.min(...distance);
    const index = distance.indexOf(min);

    if (min > DISTANCE || index === 0 || index === functionPoints.length - 1) {
      return -1;
    }

    return index;
  },
};

export default function histogram() {
  const histogramCanvas = document.getElementById('histogramCanvas');
  const curveCanvas = document.getElementById('curveCanvas');
  const histogramBtn = document.getElementById('histogram');
  const stepInput = document.getElementById('step');
  const context = _.init(histogramCanvas, curveCanvas);

  let storage = null;
  let lastPos = [];
  let movePointIndex = -1;
  let pointCount = 0;
  let canMove = false;
  let step = 1;

  const functionPoints = [[0, CANVASH], [CANVASW, 0]];

  const update = () => {
    if (storage === null) {
      return;
    }

    console.log('update');
  };

  const updateImage = () => {
    const data = _.mapHistogram(storage.data, functionPoints);
    const tmpHistogram = _.getHistogram(data, step);

    GlobalExp2.setColorData(data, 'jpeg');

    _.drawHistogramOnCanvas(tmpHistogram, context.hcontext);
  };

  histogramBtn.addEventListener('click', () => {
    storage = GlobalExp2.getColorData();

    step = stepInput.value || 256;

    const histogramData = _.getHistogram(storage.data, step);

    _.drawHistogramOnCanvas(histogramData, context.hcontext);
    _.drawFunctionPointsOnCanvas(functionPoints, context.ccontext);
  });

  curveCanvas.addEventListener('mousedown', (e) => {
    if (storage === null) {
      return;
    }

    const { layerX, layerY, button } = e;
    const functionPoint = [layerX, layerY];
    const index = _.getClosestPoint(functionPoint, functionPoints);

    if (index === -1 && button === 0) { // add new point
      for (let i = 0, j = functionPoints.length; i < j; i += 1) {
        if (functionPoint[0] < functionPoints[i][0]) {
          if (pointCount <= MAXPOINT) {
            functionPoints.splice(i, 0, functionPoint);
            movePointIndex = i;
            pointCount += 1;
            lastPos = functionPoint;
            canMove = true;
          }
          break;
        }
      }

      _.drawFunctionPointsOnCanvas(functionPoints, context.ccontext);
    } else if (index !== -1 && button === 2) { // delete old point
      for (let i = 0, j = functionPoints.length; i < j; i += 1) {
        if (functionPoint[0] < functionPoints[i][0]) {
          functionPoints.splice(i - 1, 1);
          pointCount -= 1;
          break;
        }
      }

      _.drawFunctionPointsOnCanvas(functionPoints, context.ccontext);
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
      const rBorder = functionPoints[movePointIndex + 1][0];
      const lBorder = functionPoints[movePointIndex - 1][0];

      if (x < rBorder && x > lBorder) {
        functionPoints[movePointIndex] = [x, y];
        _.drawFunctionPointsOnCanvas(functionPoints, context.ccontext);
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

  return update;
}
