import logger from '../utils/logger';
import GlobalExp2plus from './Global_exp2plus';

const blankImageData = ((defaultWidth, defaultHeight) => {
  const cvs = document.createElement('canvas');
  const ctx = cvs.getContext('2d');

  return (width = defaultWidth, height = defaultHeight) => ctx.createImageData(width, height);
})(0, 0);

const filterManager = {
  pos(index, w) {
    const x = index % w;
    const y = Math.floor(index / w);

    return { x, y };
  },

  filter(imageData, template, type) {
    const { data, width, height } = imageData;

    const blankData = blankImageData(width, height);

    for (let i = 0, j = data.length / 4; i < j; i += 1) {
      const { x: tx, y: ty } = this.pos(i, width);
      const b1 = -(template - 1) / 2;
      const b2 = -b1;
      const tmp = [];

      for (let m = b1; m <= b2; m += 1) {
        for (let n = b1; n <= b2; n += 1) {
          const cx = tx + n;
          const cy = ty + m;

          if (cx >= 0 && cx < width && cy >= 0 && cy < height) {
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

  turnOdd(value) {
    return Math.abs(value % 2 === 1 ? value : value - 1);
  },
};

export default function filter() {
  const averageBtn = document.getElementById('average');
  const medianBtn = document.getElementById('median');
  const averageInput = document.getElementById('averageTemp');
  const medianInput = document.getElementById('medianTemp');
  let storage = null;

  const update = (data) => {
    storage = { imageData: data.decolorized };

    logger.info('filter local storage update [√]');
  };

  averageBtn.addEventListener('click', () => {
    const temp = filterManager.turnOdd(averageInput.value || 3);
    const averageData = filterManager.average(storage.imageData, temp);

    GlobalExp2plus.setImageData(averageData, averageData);
  });

  medianBtn.addEventListener('click', () => {
    const temp = filterManager.turnOdd(medianInput.value || 3);
    const medianData = filterManager.median(storage.imageData, temp);

    GlobalExp2plus.setImageData(medianData, medianData);
  });

  return update;
}
