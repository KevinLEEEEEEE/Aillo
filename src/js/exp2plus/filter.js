import imgManager from './api/imageManager';
import logger from '../utils/logger';
import GlobalExp2plus from './Global_exp2plus';

const blankCvs = (() => {
  const blank = Object.create({
    setSize(width, height) {
      this.canvas.width = width;
      this.canvas.height = height;

      return this;
    },

    getImageData() {
      return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    },
  });

  blank.canvas = document.createElement('canvas');
  blank.ctx = blank.canvas.getContext('2d');

  return blank;
})();

const filterManager = {
  pos(index, w) {
    const x = index % w;
    const y = Math.floor(index / w);

    return { x, y };
  },

  filter(imageData, template, type) {
    const { data, width, height } = imageData;

    blankCvs.setSize(width, height);

    const blankData = blankCvs.getImageData();

    for (let i = 0, j = data.length / 4; i < j; i += 1) {
      const { x: tx, y: ty } = this.pos(i, width);
      const b1 = -(template - 1) / 2;
      const b2 = -b1;
      const tmp = [];

      for (let m = b1; m <= b2; m += 1) {
        for (let n = b1; n <= b2; n += 1) {
          const cx = tx + n;
          const cy = ty + m;

          if (!(cx < 0 || cx >= width || cy < 0 || cy >= height)) {
            const index = cy * width + cx;
            const value = data[index * 4];

            tmp.push(value);
          }
        }
      }

      let finalValue = 0;

      if (type === 'average') {
        finalValue = tmp.reduce((prev, cur) => prev + cur) / tmp.length;
      } else if (type === 'median') {
        const sorted = tmp.sort();

        finalValue = sorted.length % 2 === 1
          ? sorted[(tmp.length - 1) / 2] : sorted[tmp.length / 2];
      }


      blankData.data[i * 4] = finalValue;
      blankData.data[i * 4 + 1] = finalValue;
      blankData.data[i * 4 + 2] = finalValue;
      blankData.data[i * 4 + 3] = data[i * 4 + 3];
    }

    return blankData;
  },

  average(imageData, template) {
    return this.filter(imageData, template, 'average');
  },

  median(imageData, template) {
    return this.filter(imageData, template, 'median');
  },
};

export default function filter() {
  const averageBtn = document.getElementById('average');
  const medianBtn = document.getElementById('median');
  const imageManager = imgManager();
  let storage = null;

  const update = (data) => {
    storage = { imageData: imageManager.decolorize(data.imageData) };

    logger.info('filter local storage update [√]');
  };

  averageBtn.addEventListener('click', () => {
    const averageData = filterManager.average(storage.imageData, 9);

    GlobalExp2plus.setImageData(averageData);
  });

  medianBtn.addEventListener('click', () => {
    const medianData = filterManager.median(storage.imageData, 3);

    GlobalExp2plus.setImageData(medianData);
  });

  return update;
}
