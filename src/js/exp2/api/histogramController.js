import canvasManager from './canvasManager';

const DISTANCE = 15;
const RADIUS = 3;

const prop = {
  init() {
    return this;
  },

  // --------------------------------------------------------------

  getDistance([x1, y1], [x2, y2]) {
    return Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2));
  },

  getClosestPoint(point) {
    const distance = this.linePoints.map(linePoint => this.getDistance(point, linePoint));
    const minDis = Math.min(...distance);
    const index = distance.indexOf(minDis);
    const { length } = this.linePoints;

    if (minDis > DISTANCE || index === 0 || index === length - 1) {
      return -1;
    }

    return index;
  },

  getCurveFunction([x, y]) {
    const a = Math.E ** (Math.log(x / this.width) / (y / this.height - 1));
    return (x1) => {
      const result = Math.log(x1 / this.width) / Math.log(a) + 1;

      return result >= 0 ? result * this.height : 0;
    };
  },

  getTransCoordinate([x, y]) {
    return [x, this.height - y];
  },

  // --------------------------------------------------------------

  setRadius(radius) {
    this.radius = radius;
  },

  // --------------------------------------------------------------

  mapFunction(data, func) {
    return data.map(value => func(value));
  },

  mapLine(data) {
    const transPoints = this.linePoints.map(linePoint => this.getTransCoordinate(linePoint));

    return data.map((value) => {
      let newVal = 0;

      for (let i = 0, j = transPoints.length; i < j; i += 1) {
        if (value < transPoints[i][0]) {
          const p1 = transPoints[i - 1];
          const p2 = transPoints[i];
          const k = (p2[1] - p1[1]) / (p2[0] - p1[0]);
          newVal = (value - p1[0]) * k + p1[1];
          break;
        }
      }

      return newVal;
    });
  },

  mapCurve(data) {
    const midPoint = this.curvePoints[1];
    const midTransPoint = this.getTransCoordinate(midPoint);
    const curveFunction = this.getCurveFunction(midTransPoint);

    return this.mapFunction(data, curveFunction);
  },

  // --------------------------------------------------------------

  drawLine() {
    const points = this.linePoints;

    for (let i = 0, j = points.length - 1; i < j; i += 1) {
      this.canvas.drawLine(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
      if (i < j - 1) {
        this.canvas.drawCircle(points[i + 1][0], points[i + 1][1], this.radius);
      }
    }

    return this;
  },

  drawCurve() {
    const midPoint = this.curvePoints[1];
    const midTransPoint = this.getTransCoordinate(midPoint);
    const curveFunction = this.getCurveFunction(midTransPoint);

    for (let i = 0; i < this.width; i += 1) {
      const [x, y] = this.getTransCoordinate([i, curveFunction(i)]);

      this.canvas.drawPixel(x, y);
    }

    this.canvas.drawCircle(midPoint[0], midPoint[1], this.radius);

    return this;
  },

  // --------------------------------------------------------------

  addLinePoint(point, update) {
    let cloestIndex = -1;

    for (let i = 0, j = this.linePoints.length; i < j; i += 1) {
      if (point[0] < this.linePoints[i][0]) {
        this.linePoints.splice(i, 0, point);
        cloestIndex = i;
        break;
      }
    }

    if (update === true) {
      this.empty();
      this.drawLine();
    }

    return cloestIndex;
  },

  removeLinePoint(i, update) {
    const movedPoint = this.linePoints.splice(i, 1);

    if (update === true) {
      this.empty();
      this.drawLine();
    }

    return movedPoint;
  },

  moveLinePoint(i, point, update) {
    this.linePoints[i] = point;

    if (update === true) {
      this.empty();
      this.drawLine();
    }

    return this;
  },

  moveCurvePoint(i, point, update) {
    this.curvePoints[i] = point;

    if (update === true) {
      this.empty();
      this.drawCurve();
    }

    return this;
  },

  isBorder(i, point, isCurve) {
    const leftBorder = isCurve ? this.curvePoints[i - 1][0] : this.linePoints[i - 1][0];
    const rightBorder = isCurve ? this.curvePoints[i + 1][0] : this.linePoints[i + 1][0];

    return point[0] > leftBorder && point[0] < rightBorder;
  },

  // --------------------------------------------------------------

  empty() {
    this.canvas.empty();

    return this;
  },

  resetLinePoints() {
    this.linePoints = [[0, this.height], [this.width, 0]];

    return this;
  },

  resetCurvePoints() {
    this.curvePoints = [[0, this.height], [this.width / 2, this.height / 2], [this.width, 0]];

    return this;
  },

  reset(isCurve) {
    this.empty()
      .resetCurvePoints()
      .resetLinePoints();

    if (isCurve === true) {
      this.drawCurve();
    } else {
      this.drawLine();
    }

    return this;
  },
};

export default function histogramController(canvas, width, height) {
  const myController = Object.create(prop);
  const myCanvas = canvasManager(canvas, width, height);

  myController.canvas = myCanvas;
  myController.width = width;
  myController.height = height;
  myController.radius = RADIUS;
  myController.isCurve = false;
  myController.linePoints = [[0, height], [width, 0]];
  myController.curvePoints = [[0, height], [width / 2, height / 2], [width, 0]];

  return myController.init();
}
