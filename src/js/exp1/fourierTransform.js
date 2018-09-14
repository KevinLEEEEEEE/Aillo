import imageManager from './api/imageManager';
import logger from '../utils/logger';
import fft2s from './api/myFFT/fft2';

const _fourier = {
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

  zoom(array, limit) {
    const cc = 9e-3;
    const max = Math.max(...array);
    const limitedMax = Math.log(max * cc + 1);

    return array.map((value) => {
      const color = Math.log(cc * value + 1);

      return Math.round(color * limit / limitedMax);
    });
  },

  convertPluralToArray(array) {
    return array.map(value => value.magnitude2());
  },
};

export default function _fourierransform() {
  const fft = document.getElementById('fft');
  const ifft = document.getElementById('ifft');
  const imgBox = document.getElementById('imgBox');
  let storage = null;

  fft.addEventListener('click', () => {
    if (storage !== null) {
      alert('you cannot fun fft twice!');
      return;
    }

    logger.info('', '------- Start running fft2 -------');

    const tmpCanvas = imageManager.convertImageToCanvas(imgBox);
    const { width, height } = tmpCanvas;
    const imageData = imageManager.convertCanvasToImageData(tmpCanvas, 0, 0, width, height);

    logger.info('get imageData from DOM [√]');
    // logger.debug(imageData);

    const decoloredImageData = _fourier.decolorization(imageData);
    const compressedArray = _fourier.compressImageData(decoloredImageData);

    logger.info('decolor and compress imageData [√]');
    // logger.debug(compressedArray);

    const fft2Array = fft2s.fft2(compressedArray, width, height);

    logger.info('calculate fft2 [√]');
    // logger.debug(fft2Array);

    const spectrum = _fourier.convertPluralToArray(fft2Array);
    const zoomedArray = _fourier.zoom(spectrum, 255);

    logger.info('spectrum and zoom data [√]');
    // logger.debug(zoomedArray);

    const tffCanvas = imageManager.convertArrayToCanvas(zoomedArray, width, height);

    const base64 = imageManager.convertCanvasToBase64(tffCanvas, 'jpeg');

    imgBox.setAttribute('src', base64);

    logger.info('transform data and update DOM [√]');

    storage = {
      fft: fft2Array,
      width,
      height,
    };

    logger.info('update storage and unlock ifft [√]');

    logger.info('-------- End running fft2 --------', '');
  });

  ifft.addEventListener('click', () => {
    if (storage === null) {
      alert('please run fft first!');
      return;
    }

    logger.info('', '------- Start running ifft2 -------');

    const { fft: fft2Array, width, height } = storage;

    const ifft2Array = fft2s.ifft2(fft2Array, width, height);

    logger.info('calculate ifft2 [√]');

    const regressedArray = fft2s.regress(ifft2Array, width, height);

    const ifftCanvas = imageManager.convertArrayToCanvas(regressedArray, width, height);

    const base64 = imageManager.convertCanvasToBase64(ifftCanvas, 'jpeg');

    imgBox.setAttribute('src', base64);

    logger.info('transform data and update DOM [√]');

    storage = null; // ypdate required

    logger.info('clear storage [√]');

    logger.info('-------- End running ifft2 --------', '');
  });
}
