
const prop = {
  init(width, height) {
    this.canvas.style.width = width;
    this.canvas.style.height = height;
    this.canvas.width = width;
    this.canvas.height = height;

    return this;
  },

  highResolution() {
    const backingStore = this.context.backingStorePixelRatio
    || this.context.webkitBackingStorePixelRatio
    || this.context.mozBackingStorePixelRatio
    || this.context.msBackingStorePixelRatio
    || this.context.oBackingStorePixelRatio
    || this.context.backingStorePixelRatio || 1;
    const ratio = (window.devicePixelRatio || 1) / backingStore;

    this.canvas.width = this.width * ratio;
    this.canvas.height = this.height * ratio;

    this.context.scale(ratio, ratio);

    return this;
  },

  // --------------------------------------------------------------

  getContext() {
    return this.canvas.getContext('2d');
  },

  getImageData(x = 0, y = 0, w = this.width, h = this.height) {
    return this.context.getImageData(x, y, w, h);
  },

  getBase64(format) {
    const completeFormat = `image/${format}`;

    return this.canvas.toDataURL(completeFormat);
  },

  // --------------------------------------------------------------

  setLineWidth(width = 1) {
    this.context.lineWidth = width;

    return this;
  },

  setFillStyle(r, g, b, a = 255) {
    const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;

    this.context.fillStyle = rgba;

    return this;
  },

  setStrokeStyle(r, g, b, a = 255) {
    const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;

    this.context.strokeStyle = rgba;

    return this;
  },

  // --------------------------------------------------------------

  drawPixel(x, y) {
    this.context.fillRect(x, y, 1, 1);

    return this;
  },

  drawSquare(x1, y1, w, h) {
    this.context.fillRect(x1, y1, w, h);

    return this;
  },

  drawLine(x1, y1, x2, y2) {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
    this.context.closePath();

    return this;
  },

  drawCircle(x, y, radius) {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fill();
    this.context.closePath();

    return this;
  },

  drawArray(array, isCompressed) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.setAttribute('width', this.width);
    canvas.setAttribute('height', this.height);

    const imageData = ctx.getImageData(0, 0, this.width, this.height);

    if (isCompressed === true) {
      for (let i = 0, j = this.width * this.height; i < j; i += 1) {
        imageData.data[i * 4] = array[i];
        imageData.data[i * 4 + 1] = array[i];
        imageData.data[i * 4 + 2] = array[i];
        imageData.data[i * 4 + 3] = 255;
      }
    } else {
      for (let i = 0, j = imageData.data.length; i < j; i += 1) {
        imageData.data[i] = array[i];
      }
    }

    ctx.putImageData(imageData, 0, 0);

    return this;
  },

  // --------------------------------------------------------------

  empty() {
    this.context.clearRect(0, 0, this.width, this.height);

    return this;
  },
};

export default function canvasManager(canvas, width, height) {
  const myCanvas = Object.create(prop);

  myCanvas.canvas = canvas;
  myCanvas.context = myCanvas.getContext();
  myCanvas.width = width;
  myCanvas.height = height;

  return myCanvas.init(width, height);
}
