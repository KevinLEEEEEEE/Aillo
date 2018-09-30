const Canvas = document.createElement('canvas');
const Context = Canvas.getContext('2d');

const imageManager = {
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
    Canvas.width = width;
    Canvas.height = height;

    const imageData = Context.getImageData(0, 0, width, height);

    for (let i = 0, j = width * height; i < j; i += 1) {
      imageData.data[i * 4] = array[i];
      imageData.data[i * 4 + 1] = array[i];
      imageData.data[i * 4 + 2] = array[i];
      imageData.data[i * 4 + 3] = 255;
    }

    Context.putImageData(imageData, 0, 0);

    return Canvas;
  },

  convertCanvasToBase64(canvas, format) {
    const completeFormat = `image/${format}`;

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
