import bitMapManager from './bitMapManager';
import logger from '../../utils/logger';

const SUPPORTEDFORMAT = ['png', 'jpeg', 'bmp', 'dib'];

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

  convertArrayToCanvas(array, width, height) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    for (let i = 0; i < height; i += 1) {
      for (let j = 0; j < width; j += 1) {
        const pos = i * width + j;

        ctx.fillStyle = `rgb(${array[pos]
        },${array[pos]
        },${array[pos]})`;

        ctx.fillRect(j, i, 1, 1);
      }
    }

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
};

export default imageManager;
