import GlobalExp2 from './Global_exp2';

const MAXSTEP = 256;
const CANVASW = 256;
const CANVASH = 256;

const _ = {
  init(canvas) {
    const context = canvas.getContext('2d');

    canvas.style.width = CANVASW;
    canvas.style.height = CANVASH;

    canvas.width = CANVASW;
    canvas.height = CANVASH;

    context.fillStyle = 'rgb(0, 0, 0)';
    context.lineWidth = 0.5;
    context.strokeStyle = '“#222”';

    return context;
  },

  getHistogramFromData(data, step = 256) {
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

  drawHistogramOnCanvas(histogramData, histogramContext) {
    const step = histogramData.length;
    const max = Math.round(Math.max(...histogramData) / 0.8);

    histogramContext.clearRect(0, 0, 256, 256);

    for (let i = 0; i < step; i += 1) {
      const height = Math.round(histogramData[i] * CANVASH / max);
      const width = CANVASW / step;
      const x = i * width;
      const y = CANVASH - height;

      histogramContext.fillRect(x, y, width, height);
    }
  },

  getFunctionPoint([x, y]) {
    return [x, CANVASH - y];
  },

  drawFunctionPointsOnCanvas(points, context) {
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
};

export default function histogram() {
  const histogramCanvas = document.getElementById('histogramCanvas');
  const histogramBtn = document.getElementById('histogram');
  const stepInput = document.getElementById('step');
  const context = _.init(histogramCanvas);

  let storage = null;

  const functionPoints = [[0, CANVASH], [50, 122], [150, 220], [CANVASW, 0]];

  const update = () => {

  };

  _.drawFunctionPointsOnCanvas(functionPoints, context);

  histogramBtn.addEventListener('click', () => {
    storage = GlobalExp2.getColorData();

    const step = stepInput.value;

    const histogramData = _.getHistogramFromData(storage.data, step);

    _.drawHistogramOnCanvas(histogramData, context);
  });

  histogramCanvas.addEventListener('click', (e) => {
    const { layerX, layerY } = e;
    const functionPoint = _.getFunctionPoint([layerX, layerY]);

    console.log(functionPoint);
  });

  return update;
}
