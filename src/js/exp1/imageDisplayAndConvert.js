import imageManager from './api/imageManager';
import logger from '../utils/logger';

const imageDAC = {
  init() {
    this.imgBox = document.getElementById('imgBox'); // the <img> tag
    this.imgContainer = document.getElementById('imgContainer'); // div that contains the <img>
    this.downloadBtn = document.getElementById('download');
  },

  validateAndDisplay(file) {
    if (!imageManager.isSupportedFile(file)) {
      logger.error('Please upload an image in supported format.');
      return;
    }

    const containerStyle = this.getElementStyle(this.imgContainer);
    const containerSize = { width: containerStyle.width, height: containerStyle.height };
    const objectURL = imageManager.createObjectURL(file);

    this.resizeImage(containerSize, objectURL)
      .then((value) => {
        this.imgBox.setAttribute('width', value.width);
        this.imgBox.setAttribute('height', value.height);
        this.imgBox.setAttribute('src', objectURL);

        imageDAC.convertAndSave('bmp');
      });
  },

  convertAndSave(format) {
    const canvas = imageManager.convertImageToCanvas(this.imgBox);
    const base64 = imageManager.convertCanvasToBase64(canvas, format);

    this.downloadBtn.setAttribute('href', base64);
  },

  getElementStyle(element) {
    if (window.getComputedStyle) {
      return window.getComputedStyle(element);
    }
    return element.currentStyle;
  },

  resizeImage(containerSize, src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const containerWidth = parseInt(containerSize.width, 10);
      const containerHeight = parseInt(containerSize.height, 10);
      let calculatedWidth = null;
      let calculatedHeight = null;

      image.onload = () => {
        const containerRatio = containerWidth / containerHeight;
        const imageRatio = image.naturalWidth / image.naturalHeight;

        if (containerRatio > imageRatio) {
          // the container is fatter, image reach the top and bottom
          calculatedHeight = containerHeight;
          calculatedWidth = image.naturalWidth / (image.naturalHeight / calculatedHeight);
        } else {
          // the image is fatter, reaching the left and right border
          calculatedWidth = containerWidth;
          calculatedHeight = image.naturalHeight / (image.naturalWidth / calculatedWidth);
        }

        logger.info(`image resized successfully. width: ${calculatedWidth}px  height: ${calculatedHeight}px`);

        resolve({
          width: calculatedWidth,
          height: calculatedHeight,
        });
      };

      image.onerror = (error) => {
        logger.error('image resize failure.');

        reject(error);
      };

      image.src = src;
    });
  },
};

export default function imageDisplayAndConvert() {
  const exp1 = document.getElementById('exp1');
  const inputBox = document.getElementById('inputBox');
  const imgInput = exp1.getElementsByTagName('input')[0];

  imageDAC.init();

  imgInput.addEventListener('change', (e) => {
    e.stopPropagation();

    const { target } = e;
    const { files } = target;

    logger.info('file changed by selecting.');

    imageDAC.validateAndDisplay(files[0]);
  });

  inputBox.addEventListener('dragover', (e) => {
    e.stopPropagation();
    e.preventDefault();
  });

  inputBox.addEventListener('drop', (e) => {
    e.stopPropagation();
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    logger.info('file changed by dragging.');

    imageDAC.validateAndDisplay(file);
  });
}
