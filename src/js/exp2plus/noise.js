import imgManager from './api/imageManager';
import logger from '../utils/logger';
import GlobalExp2plus from './Global_exp2plus';

const noiseManager = {
  pos(index, w) {
    const x = index % w;
    const y = Math.floor(index / w);

    return { x, y };
  },

  peppersalt(imageData, SNR) {
    const { data, width, height } = imageData;
    const sp = width * height;
    const np = sp * (1 - SNR);

    for (let i = 0; i < np; i += 1) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      const r = Math.round(Math.random());
      const index = y * width + x;

      if (r === 0) {
        data[index * 4] = 0;
        data[index * 4 + 1] = 0;
        data[index * 4 + 2] = 0;
      } else {
        data[index * 4] = 255;
        data[index * 4 + 1] = 255;
        data[index * 4 + 2] = 255;
      }
    }

    return imageData;
  },

  gaussianGenerator(mu, sigma) {
    const distribution = () => {
      let u = 0;
      let v = 0;
      let w = 0;
      let c = 0;

      do {
        u = Math.random() * 2 - 1.0;
        v = Math.random() * 2 - 1.0;
        w = u * u + v * v;
      } while (w === 0.0 || w >= 1.0);

      c = Math.sqrt((-2 * Math.log(w)) / w);

      return u * c;
    };

    return mu + sigma * distribution();
  },

  gaussian(imageData, mu, sigma, k) {
    const { data, width, height } = imageData;

    for (let i = 0; i < height; i += 1) {
      for (let j = 0; j < width; j += 1) {
        const index = width * i + j;
        const add = k * this.gaussianGenerator(mu, sigma);
        let value = data[index * 4] + add;

        if (value > 255) value = 255;
        if (value < 0) value = 0;

        data[index * 4] = value;
        data[index * 4 + 1] = value;
        data[index * 4 + 2] = value;
      }
    }

    return imageData;
  },
};

export default function noise() {
  const peppersalt = document.getElementById('peppersalt');
  const gaussian = document.getElementById('gaussian');
  const snrInput = document.getElementById('snr');
  const muInput = document.getElementById('mu');
  const sigmaInput = document.getElementById('sigma');
  const kInput = document.getElementById('k');
  const imageManager = imgManager();
  let storage = null;

  const update = (data) => {
    storage = { imageData: imageManager.decolorize(data.imageData) };

    logger.info('filter local storage update [√]');
  };

  peppersalt.addEventListener('click', () => {
    const snr = snrInput.value || 0.9;
    const peppersaltData = noiseManager.peppersalt(storage.imageData, snr);

    GlobalExp2plus.setImageData(peppersaltData);
  });

  gaussian.addEventListener('click', () => {
    const mu = muInput.value || 0;
    const sigma = sigmaInput.value || 1;
    const k = kInput.value || 128;
    const gaussianData = noiseManager.gaussian(storage.imageData, mu, sigma, k);

    GlobalExp2plus.setImageData(gaussianData);
  });

  return update;
}
