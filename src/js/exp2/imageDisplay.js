import imageManager from './api/imageManager';
import logger from '../utils/logger';
import GlobalExp2 from './Global_exp2';

const imageDAC = {
  init() {
    this.imgBox = document.getElementById('imgBox2'); // the <img> tag
    this.imgContainer = document.getElementById('imgContainer2'); // div that contains the <img>
    this.inputHelper = document.getElementById('inputHelper2');
  },

  display(file) {
    const containerStyle = this.getElementStyle(this.imgContainer);
    const containerSize = { width: containerStyle.width, height: containerStyle.height };
    const objectURL = imageManager.createObjectURL(file);

    this.resizeImage(containerSize, objectURL)
      .then((value) => {
        this.hideHelper();

        this.imgBox.setAttribute('width', value.width);
        this.imgBox.setAttribute('height', value.height);
        this.imgBox.setAttribute('src', objectURL);

        GlobalExp2.update();

        GlobalExp2.notify();
      });
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

  hideHelper() {
    this.inputHelper.classList.add('hide');
  },
};

export default function imageDisplayAndConvert() {
  const exp2 = document.getElementById('exp2');
  const inputBox = document.getElementById('inputBox2');
  const imgInput = exp2.getElementsByTagName('input')[0];

  imageDAC.init();

  imgInput.addEventListener('change', (e) => {
    e.stopPropagation();

    const { target } = e;
    const { files } = target;

    logger.info('file changed by selecting.');

    imageDAC.display(files[0]);
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

    imageDAC.display(file);
  });
}
