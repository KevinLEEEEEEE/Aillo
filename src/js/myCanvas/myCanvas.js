// import canvasManager from './components/canvasManager';
import canvasManager from './components/canvasManager2';
import history from './components/history3';

export default function myCanvas2d(canvas, maxStep = 5) {
  const context = canvas.getContext('2d');
  const that = canvasManager(canvas);
  const myHistory = history(maxStep);

  Object.assign(that, {
    do() {

    },

    undo() {

    },

    redo() {

    },

    putImage(image) {
      const { width, height } = image;

      this.setSize(width, height);
      context.drawImage(image);

      return this;
    },

    putImageData(imageData) {
      const { width, height } = imageData;

      this.setSize(width, height);
      context.putImageData(imageData, 0, 0);

      return this;
    },

    empty() {
      const { width, height } = this.getSize();

      context.clearRect(0, 0, width, height);

      return this;
    },
  });

  return that;
}
