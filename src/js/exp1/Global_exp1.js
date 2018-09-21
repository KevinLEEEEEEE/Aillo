import imageDisplayAndConvert from './imageDisplayAndConvert';
import fourierTransform from './fourierTransform';
import discreteCosineTransform from './discreteCosineTransform';
import walahHadamardTrans from './walahHadamardTrans';

import imageManager from './api/imageManager';
import logger from '../utils/logger';

const _ = {

};

const GlobalExp1 = {
  init() {
    imageDisplayAndConvert();
    const m1 = fourierTransform();
    const m2 = discreteCosineTransform();
    const m3 = walahHadamardTrans();

    logger.info('[G] init all events [√]');

    this.imgBox = document.getElementById('imgBox');
    this.monitorList = [m1, m2];
    this.storage = null;

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

    logger.info('[G] transform data into base64 [√]');

    this.imgBox.setAttribute('src', base64);

    logger.info('[G] update DOM [√]');
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

    this.monitorList.map(value => value());

    logger.info('[G] clear all local storage [√]');
  },

};

export default GlobalExp1;
