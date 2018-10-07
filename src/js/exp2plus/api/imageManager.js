
const prop = {
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

  convertFileToObjectURL(file) {
    const objectURL = window.URL.createObjectURL(file);

    return Promise.resolve(objectURL);
  },

  // --------------------------------------------------------------

  convertBase64ToImage(base64) {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        resolve(image);
      };

      image.onerror = (error) => {
        reject(error);
      };

      image.src = base64;
    });
  },

  convertImageToBase64(image) {
    return this.convertImageToCanvas(image)
      .then(canvas => this.convertCanvasToBase64(canvas));
  },

  // --------------------------------------------------------------

  convertImageToCanvas(image) {
    const canvas = document.createElement('canvas');

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext('2d').drawImage(image, 0, 0);

    return Promise.resolve(canvas);
  },

  convertCanvasToImage(canvas) {
    return this.convertCanvasToBase64(canvas)
      .then(base64 => this.convertBase64ToImage(base64));
  },

  // --------------------------------------------------------------

  convertCanvasToBase64(canvas, format) {
    const completeFormat = `image/${format}`;

    const dataURL = canvas.toDataURL(completeFormat);

    return Promise.resolve(dataURL);
  },

  convertBase64ToCanvas(base64) {
    return this.convertBase64ToImage(base64)
      .then(image => this.convertImageToCanvas(image));
  },

  // --------------------------------------------------------------

  assembleImageData(pixelData, width, height) {
    if (typeof window === 'object') {
      return new window.ImageData(pixelData, width, height);
    }
    return { data: pixelData, width, height };
  },

  assemblePixelData(length) {
    return new Uint8ClampedArray(length);
  },
};


export default function imageManager() {
  const manager = Object.create(prop);

  manager.decolorize = (imageData) => {
    const { data, width, height } = imageData;
    const pixelData = manager.assemblePixelData(data.length);

    for (let i = 0, j = data.length; i < j; i += 4) {
      const grayLevel = (data[i] + data[i + 1] + data[i + 2]) / 3;

      pixelData[i] = grayLevel;
      pixelData[i + 1] = grayLevel;
      pixelData[i + 2] = grayLevel;
      pixelData[i + 3] = data[i + 3];
    }

    return manager.assembleImageData(pixelData, width, height);
  };

  return manager;
}
