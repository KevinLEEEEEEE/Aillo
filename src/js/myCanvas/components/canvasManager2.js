export default function canvasManager(canvas) {
  const context = canvas.getContext('2d');
  const parentStyle = window.getComputedStyle(canvas.parentNode);

  const that = {
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

    getRatio() {
      const backingStore = context.backingStorePixelRatio
      || context.webkitBackingStorePixelRatio
      || context.mozBackingStorePixelRatio
      || context.msBackingStorePixelRatio
      || context.oBackingStorePixelRatio
      || context.backingStorePixelRatio || 1;

      return (window.devicePixelRatio || 1) / backingStore;
    },

    getWidth() {
      return canvas.width;
    },

    getHeight() {
      return canvas.height;
    },

    getSize() {
      return {
        width: this.getWidth(),
        height: this.getHeight(),
      };
    },

    getStyleWidth() {
      const style = window.getComputedStyle(canvas);

      return parseFloat(style.width);
    },

    getStyleHeight() {
      const style = window.getComputedStyle(canvas);

      return parseFloat(style.height);
    },

    getStyleSize() {
      return {
        width: this.getStyleWidth(),
        height: this.getStyleHeight(),
      };
    },

    getImageData(x = 0, y = 0, w = this.getWidth(), h = this.getHeight()) {
      return context.getImageData(x, y, w, h);
    },

    getBase64(format = 'jpeg') {
      const completeFormat = `image/${format}`;

      return canvas.toDataURL(completeFormat);
    },

    // --------------------------------------------------------------

    setWidth(width = 0) {
      canvas.width = width;

      return this;
    },

    setHeight(height = 0) {
      canvas.height = height;

      return this;
    },

    setSize(width, height) {
      return this.setWidth(width).setHeight(height);
    },

    setStyleWidth(width = 0) {
      canvas.style.width = `${width}px`;

      return this;
    },

    setStyleHeight(height = 0) {
      canvas.style.height = `${height}px`;

      return this;
    },

    setStyleSize(width, height) {
      return this.setStyleWidth(width).setStyleHeight(height);
    },

    setScale(scaleX = 1, scaleY = 1) {
      context.scale(scaleX, scaleY);

      return this;
    },

    setLineWidth(width = 1) {
      context.lineWidth = width;

      return this;
    },

    setFillStyle(r = 0, g = 0, b = 0, a = 255) {
      const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;

      context.fillStyle = rgba;

      return this;
    },

    setStrokeStyle(r = 0, g = 0, b = 0, a = 255) {
      const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;

      context.strokeStyle = rgba;

      return this;
    },
  };

  return that;
}
