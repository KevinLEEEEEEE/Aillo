import imageManager from './api/imageManager';
import logger from '../utils/logger';

const STATE = {
  wait: 0,
  ready: 1,
};

const imageDAC = {
  init() {
    this.imgBox = document.getElementById('imgBox'); // the <img> tag
    this.imgContainer = document.getElementById('imgContainer'); // div that contains the <img>
    this.downloadBtn = document.getElementById('download');
    this.inputHelper = document.getElementById('inputHelper');
    this.nameInput = document.getElementById('rename');

    Reflect.defineProperty(imageDAC, 'state', {
      get() {
        return this._state;
      },
      set(value) {
        this._state = value;
        this.checkDownloadBtn(value);
      },
    });

    this.state = STATE.wait;
  },

  validateAndDisplay(file) {
    this.state = STATE.wait;

    if (!imageManager.isSupportedFile(file)) {
      logger.error('Please upload an image in supported format.');
      return;
    }

    const containerStyle = this.getElementStyle(this.imgContainer);
    const containerSize = { width: containerStyle.width, height: containerStyle.height };
    const objectURL = imageManager.createObjectURL(file);
    const { name } = file;

    this.resizeImage(containerSize, objectURL)
      .then((value) => {
        this.hideHelper();

        this.setName(name);

        this.imgBox.setAttribute('width', value.width);
        this.imgBox.setAttribute('height', value.height);
        this.imgBox.setAttribute('src', objectURL);

        this.convertImage('jpeg');
      });
  },

  convertImage(format) {
    this.state = STATE.wait;

    const canvas = imageManager.convertImageToCanvas(this.imgBox);
    const base64 = imageManager.convertCanvasToBase64(canvas, format);

    this.downloadBtn.setAttribute('href', base64);

    logger.info(`convert file format to: ${format}`);

    this.state = STATE.ready;
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

    logger.info('hide upload helper');
  },

  setName(name) {
    const formatedName = name.split('.')[0];

    this.nameInput.value = formatedName;

    this.downloadBtn.setAttribute('download', name);

    logger.info(`init file name to: ${formatedName}`);
  },

  rename(name) {
    this.downloadBtn.setAttribute('download', name);

    logger.info(`reset file name to: ${name}`);
  },

  getName() {
    return this.rename.value;
  },

  checkDownloadBtn(value) {
    if (value === STATE.ready) {
      this.canDownload();
    } else if (value === STATE.wait) {
      this.cannotDownload();
    }
  },

  canDownload() {
    this.downloadBtn.classList.remove('disable');
    this.downloadBtn.classList.add('enable');

    logger.info('download button abled');
  },

  cannotDownload() {
    this.downloadBtn.classList.remove('enable');
    this.downloadBtn.classList.add('disable');

    logger.info('download button disabled');
  },
};

export default function imageDisplayAndConvert() {
  const exp1 = document.getElementById('exp1');
  const inputBox = document.getElementById('inputBox');
  const formatSelection = document.getElementById('formatSelection');
  const imgInput = exp1.getElementsByTagName('input')[0];
  const rename = document.getElementById('rename');
  const downloadBtn = document.getElementById('download');

  imageDAC.init();

  imgInput.addEventListener('change', (e) => {
    if (imageDAC.state !== STATE.wait) {
      return;
    }

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
    if (imageDAC.state !== STATE.wait) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    logger.info('file changed by dragging.');

    imageDAC.validateAndDisplay(file);
  });

  formatSelection.addEventListener('change', () => {
    if (imageDAC.state === STATE.wait) {
      return;
    }

    const selectedFormat = formatSelection[formatSelection.selectedIndex].value;

    imageDAC.convertImage(selectedFormat);
  });

  rename.addEventListener('change', () => {
    if (imageDAC.state === STATE.wait) {
      return;
    }

    const newName = rename.value;

    imageDAC.rename(newName);
  });

  downloadBtn.addEventListener('click', (e) => {
    if (imageDAC.state === STATE.wait) {
      e.stopPropagation();
      e.preventDefault();
    }
  });
}
