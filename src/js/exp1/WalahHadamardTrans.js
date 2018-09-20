import imageManager from './api/imageManager';
import logger from '../utils/logger';
import whts from './api/myWHT/wht';
import wht88s from './api/myWHT/wht88';

export default function WalahHadamardTrans() {
  const wht = document.getElementById('wht');
  const iwht = document.getElementById('iwht');
  const imgBox = document.getElementById('imgBox');
  let storage = null;

  // const i = whts.wht([0, 0, 1, 1, 0, 0, 1, 1]);
  // const g = wht88s.wht88([1, 3, 3, 1, 1, 3, 3, 1, 1, 3, 3, 1, 1, 3, 3, 1], 4, 4);

  // console.log(g);

  wht.addEventListener('click', () => {
    if (storage !== null) {
      alert('you cannot fun fft twice!');
      return;
    }

    logger.info('', '------- Start running wht88 -------');

    const tmpCanvas = imageManager.convertImageToCanvas(imgBox);
    const { width, height } = tmpCanvas;
    const imageData = imageManager.convertCanvasToImageData(tmpCanvas, 0, 0, width, height);

    logger.info('get imageData from DOM [√]');
    // logger.debug(imageData);

    const decoloredImageData = imageManager.decolorization(imageData);
    const compressedArray = imageManager.compressImageData(decoloredImageData);

    logger.info('decolor and compress imageData [√]');
    // logger.debug(compressedArray);

    const wht88Array = wht88s.wht88(compressedArray, width, height);

    logger.info('calculate wht88 [√]');

    const tffCanvas = imageManager.convertArrayToCanvas(wht88Array, width, height);

    const base64 = imageManager.convertCanvasToBase64(tffCanvas, 'jpeg');

    imgBox.setAttribute('src', base64);

    logger.info('transform data and update DOM [√]');

    storage = {
      wht: wht88Array,
      width,
      height,
    };

    logger.info('update storage and unlock idct [√]');

    logger.info('-------- End running wht88 --------', '');
  });

  iwht.addEventListener('click', () => {

  });
}
