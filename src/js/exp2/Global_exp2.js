import imageDisplay from './imageDisplay';
import histogram2 from './histogram2';
import manipulation from './manipulation';

import imageManager from './api/imageManager';
import logger from '../utils/logger';

const GlobalExp2 = {
  init() {
    imageDisplay();
    const m1 = histogram2();
    const m2 = manipulation();

    logger.info('[G] init all events listener [√]');

    this.imgBox = document.getElementById('imgBox2');
    this.monitorList = [m1, m2];
    this.storage = {
      data: null,
      width: null,
      height: null,
    };

    logger.info('[G] init Global storage [√]');
  },

  getColorData() {
    return {
      data: this.storage.compressedArray,
      width: this.storage.width,
      height: this.storage.height,
    };
  },

  setColorData(array, type = 'none') {
    const { width, height } = this.storage;
    const tffCanvas = imageManager.convertArrayToCanvas(array, width, height);
    const base64 = imageManager.convertCanvasToBase64(tffCanvas, 'jpeg');

    // logger.info('[G] transform data into base64 [√]');

    this.imgBox.onload = () => {
      this.update();
    };

    this.imgBox.src = base64;

    // logger.info('[G] update DOM [√]');
  },

  update() {
    const tmpCanvas = imageManager.convertImageToCanvas(this.imgBox);
    const { width, height } = tmpCanvas;
    const imageData = imageManager.convertCanvasToImageData(tmpCanvas, 0, 0, width, height);

    logger.info('[G] get imageData from DOM [√]');

    const decoloredImageData = imageManager.decolorization(imageData);
    const compressedArray = imageManager.compressImageData(decoloredImageData);

    logger.info('[G] decolor and compress imageData [√]');

    this.storage = Object.freeze({
      imageData,
      decoloredImageData,
      compressedArray,
      width,
      height,
    });

    logger.info('[G] update Global storage [√]');
  },

  notify() {
    this.monitorList.map(value => value());
  },
};

export default GlobalExp2;
