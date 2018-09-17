import imageManager from './api/imageManager';
import logger from '../utils/logger';
import dct88s from './api/myDCT/dct88';

export default function discreteCosineTransform() {
  const dct = document.getElementById('dct');
  const idct = document.getElementById('idct');
  const imgBox = document.getElementById('imgBox');
  let storage = null;

  dct.addEventListener('click', () => {
    if (storage !== null) {
      alert('you cannot fun dct twice!');
    }

    logger.info('', '------- Start running dct88 -------');

    const tmpCanvas = imageManager.convertImageToCanvas(imgBox);
    const { width, height } = tmpCanvas;
    const imageData = imageManager.convertCanvasToImageData(tmpCanvas, 0, 0, width, height);

    logger.info('get imageData from DOM [√]');
    // logger.debug(imageData);

    const decoloredImageData = imageManager.decolorization(imageData);
    const compressedArray = imageManager.compressImageData(decoloredImageData);

    logger.info('decolor and compress imageData [√]');
    // logger.debug(compressedArray);

    const dct88Array = dct88s.dct88(compressedArray, width, height);

    logger.info('calculate dct88 [√]');

    const tffCanvas = imageManager.convertArrayToCanvas(dct88Array, width, height);

    const base64 = imageManager.convertCanvasToBase64(tffCanvas, 'jpeg');

    imgBox.setAttribute('src', base64);

    logger.info('transform data and update DOM [√]');

    storage = {
      dct: dct88Array,
      width,
      height,
    };

    logger.info('update storage and unlock idct [√]');

    logger.info('-------- End running dct88 --------', '');
  });

  idct.addEventListener('click', () => {});
}
