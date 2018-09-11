import imageManager from './api/imageManager';
import matrixManager from './api/matrixManager';
import fft2 from './api/fft2';
import logger from '../utils/logger';

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

    return imageData;
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

  completeArray(array, cwidth, cheight) {
    const { length } = array;

    for (let i = 0; i < length; i += 1) {
      for (let j = array[i].length; j < cwidth; j += 1) {
        array[i][j] = 0;
      }
    }

    for (let i = length; i < cheight; i += 1) {
      array[i] = [];
      for (let j = 0; j < cwidth; j += 1) {
        array[i][j] = 0;
      }
    }

    return array;
  },
};

export default function _fourierransform() {
  const fourier = document.getElementById('fourier');
  const imgBox = document.getElementById('imgBox');

  fourier.addEventListener('click', () => {
    const tmpCanvas = imageManager.convertImageToCanvas(imgBox);
    const { width, height } = tmpCanvas;
    const imageData = imageManager.convertCanvasToImageData(tmpCanvas, 0, 0, width, height);

    logger.debug(`imageData  width: ${width}px,  height: ${height}px`);
    console.log(imageData);

    const decoloredImageData = _fourier.decolorization(imageData);
    const compressedArray = _fourier.compressImageData(decoloredImageData);
    const twoDimensionArray = matrixManager.oneDimensionToTwo(compressedArray, width, height);

    logger.debug(`twoDimensionArray  width: ${twoDimensionArray[0].length},  height: ${twoDimensionArray.length}`);
    console.log(twoDimensionArray);

    const cWidth = 1 << Math.ceil(_fourier.log2X(width));
    const cHeight = 1 << Math.ceil(_fourier.log2X(height));
    const completeArray = _fourier.completeArray(twoDimensionArray, cWidth, cHeight);

    logger.debug(`completed  width: ${completeArray[0].length},  height: ${completeArray.length}`);
    console.log(completeArray);

    const fftedArray = fft2(completeArray, cWidth, cHeight);

    // const tmp = [
    //   [0, 1, 2, 3],
    //   [0, 4, 2, 8],
    //   [1, 3, 2, 9],
    //   [5, 1, 3, 3],
    // ];

    // const fftedArray = fft2(tmp, 4, 4);

    logger.debug('fftedArray: ');
    console.log(fftedArray);

    const flattedArray = matrixManager.twoDimensionsToOne(fftedArray, cWidth, cHeight);

    logger.debug('flattedArray: ');
    console.log(flattedArray);

    const spectrum = matrixManager.convertPluralToArray(flattedArray);

    console.log(spectrum);
  });
}
