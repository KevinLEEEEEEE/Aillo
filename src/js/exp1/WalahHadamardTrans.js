import imageManager from './api/imageManager';
import logger from '../utils/logger';
import whts from './api/myWHT/wht';

const _ = {

};

export default function WalahHadamardTrans() {
  const wht = document.getElementById('wht');
  const iwht = document.getElementById('iwht');
  const imgBox = document.getElementById('imgBox');
  const storage = null;

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
  });

  iwht.addEventListener('click', () => {

  });
}
