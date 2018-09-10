import imageManager from './api/imageManager';
import matrixManager from './api/matrixManager';
import fft2 from './api/fft2';

const _fourier = {
  log2X(x) {
    return Math.log(x) / Math.log(2);
  },

  decolorization(imageData) {
    const { data } = imageData;
    const { length } = data;

    for (let index = 0; index < length; index += 4) {
      const grayScale = (data[index] + data[index + 1] + data[index + 2]) / 3;

      data[index] = grayScale;
      data[index + 1] = grayScale;
      data[index + 2] = grayScale;
    }
  },

  compressImageData(imageData) {
    const { data } = imageData;
    const { length } = data;
    const tmpArray = [];

    for (let index = 0; index < length; index += 4) {
      tmpArray.push(data[index]);
    }

    return tmpArray;
  },

  completeArray(array, completewidth, completeheight) {
    const { length } = array;

    for (let i = 0; i < length; i += 1) {
      const row = array[i];
      const rowLength = row.length;
      const disparityW = completewidth - rowLength;

      for (let j = 0; j < disparityW; j += 1) {
        row[j + rowLength] = 0;
      }
    }

    const disparityH = completeheight - length;

    for (let i = 0; i < disparityH; i += 1) {
      array[i + length] = [];
      for (let j = 0; j < completewidth; j += 1) {
        array[i + length][j] = 0;
      }
    }
  },
};

export default function _fourierransform() {
  const fourier = document.getElementById('fourier');
  const imgBox = document.getElementById('imgBox');

  fourier.addEventListener('click', () => {
    const tmpCanvas = imageManager.convertImageToCanvas(imgBox);
    const { width, height } = tmpCanvas;
    const imageData = imageManager.convertCanvasToImageData(tmpCanvas, 0, 0, width, height);

    _fourier.decolorization(imageData);

    const comporessedArray = _fourier.compressImageData(imageData);
    const twoDimensionArray = matrixManager.oneDimensionToTwo(comporessedArray, width, height);

    const completeWidth = 1 << Math.ceil(_fourier.log2X(width));
    const completeHeight = 1 << Math.ceil(_fourier.log2X(height));

    _fourier.completeArray(twoDimensionArray, completeWidth, completeHeight);

    // console.log(twoDimensionArray);

    fft2(twoDimensionArray);
  });
}
