
const prop = {
  init(width, height) {
    return this.resize(width, height);
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

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.canvas.width = width;
    this.canvas.height = height;

    return this;
  },

  adjustToParent() {
    const pWidth = parseInt(this.parentStyle.width, 10);
    const pHeight = parseInt(this.parentStyle.height, 10);
    const pRatio = pWidth / pHeight;
    const ratio = this.width / this.height;
    let scale = 1;

    if (pRatio > ratio) {
      scale = pHeight / this.height;
    } else {
      scale = pWidth / this.width;
    }

    this.canvas.style.width = `${this.width * scale}px`;
    this.canvas.style.height = `${this.height * scale}px`;

    return this;
  },

  // --------------------------------------------------------------

  getContext2d() {
    return this.canvas.getContext('2d');
  },

  getContext3d() {
    return this.canvas.getContext('3d');
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

  setImageData(imageData) {
    const { width, height } = imageData;

    this.resize(width, height);

    this.context.putImageData(imageData, 0, 0);

    return this;
  },

  setBase64(base64) {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        this.drawImage(image);

        resolve();
      };

      image.onerror = (error) => {
        reject(error);
      };

      image.src = base64;
    });
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

  drawImage(image) {
    const { width, height } = image;

    this.resize(width, height);

    this.context.drawImage(image, 0, 0, width, height);

    return this;
  },

  // --------------------------------------------------------------

  empty() {
    this.context.clearRect(0, 0, this.width, this.height);

    return this;
  },
};

export default function canvasManager(canvas, width = 0, height = 0) {
  const myCanvas = Object.create(prop);

  myCanvas.canvas = canvas;
  myCanvas.context = myCanvas.getContext2d();
  myCanvas.parentStyle = window.getComputedStyle(canvas.parentNode);
  myCanvas.width = width;
  myCanvas.height = height;

  return myCanvas.init(width, height);
}
