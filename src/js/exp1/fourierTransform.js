import imageManager from './api/imageManager';
import matrixManager from './api/matrixManager';
// import fft2 from './api/fft2';
// import fft from './api/fft';
import logger from '../utils/logger';
import fft2s from './api/myFFT/fft2';

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

  // unCompressArray(array) {
  //   const uncompress = [];

  //   array.forEach((element) => {
  //     uncompress.push(element);
  //     uncompress.push(element);
  //     uncompress.push(element);
  //     uncompress.push('255');
  //   });

  //   return uncompress;
  // },

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
    // const tmpCanvas = imageManager.convertImageToCanvas(imgBox);
    // const { width, height } = tmpCanvas;
    // const imageData = imageManager.convertCanvasToImageData(tmpCanvas, 0, 0, width, height);

    // logger.debug(`imageData:  width: ${width}px, height: ${height}px`);
    // console.log(imageData);

    // const decoloredImageData = _fourier.decolorization(imageData);
    // const compressedArray = _fourier.compressImageData(decoloredImageData);

    // logger.debug('compressedArray: ');
    // console.log(compressedArray);

    const compressedArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const width = 4;
    const height = 3;

    const fft2Array = fft2s.fft2(compressedArray, width, height);

    logger.debug('fft2Array: ');
    console.log(fft2Array);

    // const spectrum = matrixManager.convertPluralToArray(fft2Array);

    // logger.debug('oneDimensionArray');
    // console.log(spectrum);

    // const zoomedArray = matrixManager.zoom(spectrum, 255);

    // logger.debug('zoomedArray');
    // console.log(zoomedArray);

    // const newCanvas = imageManager.convertArrayToCanvas(zoomedArray, width, height);

    // const base64 = imageManager.convertCanvasToBase64(newCanvas, 'png');

    // imgBox.setAttribute('src', base64);

    const test = fft2s.ifft2(fft2Array, width, height);

    const test2 = fft2s.regress(test, width, height);

    console.log(test2);

    // const newCanvas = imageManager.convertArrayToCanvas(test2, cWidth, cHeight);

    // // const base64 = imageManager.convertCanvasToBase64(newCanvas, 'png');

    // // imgBox.setAttribute('src', base64);


    // document.getElementById('exp1').appendChild(newCanvas);
  });
}
