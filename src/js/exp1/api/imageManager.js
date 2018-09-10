import bitMapManager from './bitMapManager';
import logger from '../../utils/logger';

const SUPPORTEDFORMAT = ['png', 'jpeg', 'bmp'];

const imageManager = {
  isSupportedFile(file) {
    if (!file) {
      return false;
    }

    const { type } = file;
    const [fileType = 'unknown', format = 'png'] = type.split('/');

    if (fileType !== 'image') {
      return false;
    }

    if (SUPPORTEDFORMAT.indexOf(format) === -1) {
      return false;
    }

    return true;
  },

  convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(file);

      reader.onload = (event) => {
        const base64 = event.target.result;
        resolve(base64);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  },

  convertImageToCanvas(image) {
    const canvas = document.createElement('canvas');

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext('2d').drawImage(image, 0, 0);

    return canvas;
  },

  convertCanvasToBase64(canvas, format) {
    const completeFormat = `image/${format}`;

    if (format === 'bmp') {
      return bitMapManager.convertCanvasToBase64(canvas);
    }

    return canvas.toDataURL(completeFormat);
  },

  convertCanvasToImageData(canvas, x, y, width, height) {
    return canvas.getContext('2d').getImageData(x, y, width, height);
  },

  createObjectURL(file) {
    return window.URL.createObjectURL(file);
  },
};

export default imageManager;
