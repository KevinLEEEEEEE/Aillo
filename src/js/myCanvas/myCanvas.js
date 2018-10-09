import shape from './components/shape';
import history from './components/history';

const maxStep = 5;

const prop = {
  shape,

  // --------------------------------------------------------------

  getRatio() {
    const backingStore = this.context.backingStorePixelRatio
    || this.context.webkitBackingStorePixelRatio
    || this.context.mozBackingStorePixelRatio
    || this.context.msBackingStorePixelRatio
    || this.context.oBackingStorePixelRatio
    || this.context.backingStorePixelRatio || 1;

    return (window.devicePixelRatio || 1) / backingStore;
  },

  highResolution() {
    const ratio = this.getRatio();
    const size = this.getSize();

    this.setSize(size.width * ratio, size.height * ratio)
      .setScale(ratio, ratio);

    return this;
  },

  lowResolution() {
    const ratio = this.getRatio();
    const size = this.getSize();

    this.setSize(size.width / ratio, size.height / ratio)
      .setScale(1, 1);

    return this;
  },

  adjustToParent() {
    const { parentNode } = this.canvas;
    const parentStyle = window.getComputedStyle(parentNode);

    const pWidth = parseFloat(parentStyle.width);
    const pHeight = parseFloat(parentStyle.height);
    const { width, height } = this.getSize();

    const pRatio = pWidth / pHeight;
    const ratio = width / height;

    const scale = pRatio > ratio ? pHeight / height : pWidth / width;

    this.setStyleSize(width * scale, height * scale);

    return this;
  },

  // --------------------------------------------------------------

  getWidth() {
    return this.canvas.width;
  },

  getHeight() {
    return this.canvas.height;
  },

  getSize() {
    return {
      width: this.getWidth(),
      height: this.getHeight(),
    };
  },

  getStyleWidth() {
    const style = window.getComputedStyle(this.canvas);

    return parseFloat(style.width);
  },

  getStyleHeight() {
    const style = window.getComputedStyle(this.canvas);

    return parseFloat(style.height);
  },

  getStyleSize() {
    return {
      width: this.getStyleWidth(),
      height: this.getStyleHeight(),
    };
  },

  getImageData(x = 0, y = 0, w = this.width, h = this.height) {
    return this.context.getImageData(x, y, w, h);
  },

  getBase64(format = 'jpeg') {
    const completeFormat = `image/${format}`;

    return this.canvas.toDataURL(completeFormat);
  },

  // --------------------------------------------------------------

  setWidth(width = 0) {
    this.canvas.width = width;

    return this;
  },

  setHeight(height = 0) {
    this.canvas.height = height;

    return this;
  },

  setSize(width, height) {
    return this.setWidth(width).setHeight(height);
  },

  setStyleWidth(width = 0) {
    this.canvas.style.width = `${width}px`;

    return this;
  },

  setStyleHeight(height = 0) {
    this.canvas.style.height = `${height}px`;

    return this;
  },

  setStyleSize(width, height) {
    return this.setStyleWidth(width).setStyleHeight(height);
  },

  setScale(scaleX = 1, scaleY = 1) {
    this.context.scale(scaleX, scaleY);

    return this;
  },

  setLineWidth(width = 1) {
    this.context.lineWidth = width;

    return this;
  },

  setFillStyle(r = 0, g = 0, b = 0, a = 255) {
    const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;

    this.context.fillStyle = rgba;

    return this;
  },

  setStrokeStyle(r = 0, g = 0, b = 0, a = 255) {
    const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;

    this.context.strokeStyle = rgba;

    return this;
  },

  // --------------------------------------------------------------

  putImage(image, isRecord = true) {
    const { width, height } = image;

    this.setSize(width, height).context.drawImage(image);

    if (isRecord === true) this.do();

    this.update();

    return this;
  },

  putImageData(imageData, isRecord = true) {
    const { width, height } = imageData;

    this.setSize(width, height).context.putImageData(imageData, 0, 0);

    if (isRecord === true) this.do();

    this.update();

    return this;
  },

  // --------------------------------------------------------------

  refresh() {

  },

  empty() {
    const { width, height } = this.getSize();

    this.context.clearRect(0, 0, width, height);

    return this;
  },

  update() {
    return this;
  },

  // --------------------------------------------------------------

  do() { // recoed the step as the latest one
    const imageData = this.getImageData();

    this.history.do(imageData);

    return this;
  },

  undo() { // go back to the previous result
    const imageData = this.history.undo();

    this.putImageData(imageData, false);

    return this;
  },

  redo() { // undo the 'undo' precess
    const imageData = this.history.redo();

    this.putImageData(imageData, true);

    return this;
  },

  // --------------------------------------------------------------

  notify() {

  },
};

export default function myCamvas2d(canvas) {
  const cvs = Object.create(prop);

  cvs.canvas = canvas;
  cvs.context = canvas.getContext('2d');
  cvs.history = history(maxStep);

  return cvs;
}
