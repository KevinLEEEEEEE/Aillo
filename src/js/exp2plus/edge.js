import logger from '../utils/logger';
import GlobalExp2plus from './Global_exp2plus';

const SIZE_OF_RGB = 4;

const blankImageData = ((defaultWidth, defaultHeight) => {
  const cvs = document.createElement('canvas');
  const ctx = cvs.getContext('2d');

  return (width = defaultWidth, height = defaultHeight) => ctx.createImageData(width, height);
})(0, 0);

const edgeManager = {
  pos(index, w) {
    const x = index % w;
    const y = Math.floor(index / w);

    return { x, y };
  },

  robert(imageData) {
    const { data, width, height } = imageData;

    const blankData = blankImageData(width, height);

    for (let x = 1; x < width - 1; x += 1) {
      for (let y = 1; y < height - 1; y += 1) {
        const index11 = y * width + x;
        const index10 = (y - 1) * width + x;
        const index01 = y * width + x - 1;
        const index00 = (y - 1) * width + x - 1;

        const color11 = data[index11 * SIZE_OF_RGB];
        const color10 = data[index10 * SIZE_OF_RGB];
        const color01 = data[index01 * SIZE_OF_RGB];
        const color00 = data[index00 * SIZE_OF_RGB];

        const t = Math.abs(color11 - color00) + Math.abs(color10 - color01);

        blankData.data[index11 * SIZE_OF_RGB] = t;
        blankData.data[index11 * SIZE_OF_RGB + 1] = t;
        blankData.data[index11 * SIZE_OF_RGB + 2] = t;
        blankData.data[index11 * SIZE_OF_RGB + 3] = 255;
      }
    }

    return blankData;
  },

  laplacian(imageData) {
    const { data, width, height } = imageData;

    const blankData = blankImageData(width, height);

    for (let x = 1; x < width - 1; x += 1) {
      for (let y = 1; y < height - 1; y += 1) {
        const index11 = y * width + x;
        const index10 = (y - 1) * width + x;
        const index12 = (y + 1) * width + x;
        const index01 = y * width + x - 1;
        const index21 = y * width + x + 1;

        const color11 = data[index11 * SIZE_OF_RGB];
        const color10 = data[index10 * SIZE_OF_RGB];
        const color12 = data[index12 * SIZE_OF_RGB];
        const color01 = data[index01 * SIZE_OF_RGB];
        const color21 = data[index21 * SIZE_OF_RGB];

        const t = color01 + color21 + color10 + color12 - 4 * color11;

        blankData.data[index11 * SIZE_OF_RGB] = t;
        blankData.data[index11 * SIZE_OF_RGB + 1] = t;
        blankData.data[index11 * SIZE_OF_RGB + 2] = t;
        blankData.data[index11 * SIZE_OF_RGB + 3] = 255;
      }
    }

    return blankData;
  },

  getHistogram(data) {
    const histogram = (new Array(Number(256))).fill(0);

    for (let i = 0, j = data.length; i < j; i += 1) {
      const targetStep = Math.floor(data[i]);

      histogram[targetStep] += 1;
    }

    return histogram;
  },

  calcThreshold(histogram, t) {
    let sumHKK0 = 0;
    let sumHK0 = 0;
    let sumHKK1 = 0;
    let sumHK1 = 0;

    for (let k = 0; k < t; k += 1) {
      sumHKK0 += k * histogram[k];
      sumHK0 += histogram[k];
    }

    for (let k = t + 1; k < histogram.length; k += 1) {
      sumHKK1 += k * histogram[k];
      sumHK1 += histogram[k];
    }

    sumHK0 = sumHK0 === 0 ? 1 : sumHK0;
    sumHK1 = sumHK1 === 0 ? 1 : sumHK1;

    const t1 = sumHKK0 / sumHK0 + sumHKK1 / sumHK1;

    return Math.round(t1 / 2);
  },

  getThreshold(data) {
    const histogram = this.getHistogram(data);

    let t0 = 128;
    let t1 = -1;

    while (t0 !== t1) {
      t0 = t1;

      t1 = this.calcThreshold(histogram, t0);
    }

    return t1;
  },

  iterativeThresholding(imageData) {
    const { data, width, height } = imageData;

    const blankData = blankImageData(width, height);

    const threshold = this.getThreshold(data);

    for (let i = 0; i < width * height * 4; i += 4) {
      let value = 0;

      if (data[i] >= threshold) {
        value = data[i];
      }

      blankData.data[i] = value;
      blankData.data[i + 1] = value;
      blankData.data[i + 2] = value;
      blankData.data[i + 3] = 255;
    }

    return blankData;
  },

  regionGrowing(imageData, [x, y], k) {
    const { data, width, height } = imageData;
    const firstIndex = (y * width + x) * SIZE_OF_RGB;
    let currentValue = data[firstIndex];

    const blankData = blankImageData(width, height);

    blankData.data[firstIndex] = data[firstIndex];
    blankData.data[firstIndex + 1] = data[firstIndex + 1];
    blankData.data[firstIndex + 2] = data[firstIndex + 2];
    blankData.data[firstIndex + 3] = data[firstIndex + 3];

    const calc = (tx, ty) => {
      const range4 = [];
      let tmpValue = 0;
      const point4 = [[tx - 1, ty], [tx + 1, ty], [tx, ty + 1], [tx, ty - 1]];

      point4.forEach(([ttx, tty]) => {
        const index = (tty * width + ttx) * SIZE_OF_RGB;

        if (blankData.data[index + 3] !== 0) {
          return;
        }

        const value = data[index];

        if (Math.abs(currentValue - value) < k) {
          range4.push([ttx, tty]);

          blankData.data[index] = data[index];
          blankData.data[index + 1] = data[index + 1];
          blankData.data[index + 2] = data[index + 2];
          blankData.data[index + 3] = data[index + 3];
        }
      });

      range4.forEach(([ttx, tty]) => {
        tmpValue += data[(tty * width + ttx) * SIZE_OF_RGB];
      });

      currentValue = (currentValue + tmpValue) / (range4.length + 1);

      range4.forEach(([ttx, tty]) => {
        calc(ttx, tty);
      });
    };

    calc(x, y);

    return blankData;
  },

  runRegionGrowingOnPoint(x, y, k, ratio, imageData) {
    const xPos = Math.floor(x / ratio);
    const yPos = Math.floor(y / ratio);

    console.log(xPos, yPos);

    return this.regionGrowing(imageData, [xPos, yPos], k);
  },
};

export default function edge() {
  const robertsBtn = document.getElementById('roberts');
  const robertsInput = document.getElementById('robertsInput');
  const laplacianBtn = document.getElementById('laplacian');
  const iterativeThresholdingBtn = document.getElementById('iterativeThresholding');
  const regionGrowingBtn = document.getElementById('regionGrowing');
  const imgInput = document.getElementById('inputBox3');
  const imgContainer = document.getElementById('imgContainer3');

  const containerRect = imgContainer.getBoundingClientRect();
  const inputRect = imgInput.getBoundingClientRect();
  const xDis = containerRect.left - inputRect.left;
  const yDis = containerRect.top - inputRect.top;
  let storage = null;

  const update = (data) => {
    storage = { imageData: data.decolorized };

    logger.info('filter local storage update [√]');
  };

  const calcScaleRatio = () => {
    const { width, height } = storage.imageData;

    if (width > height) {
      return containerRect.width / width;
    }
    return containerRect.height / height;
  };

  robertsBtn.addEventListener('click', () => {
    const edgeData = edgeManager.robert(storage.imageData);

    console.log(edgeData);

    GlobalExp2plus.setImageData(edgeData, edgeData);
  });

  laplacianBtn.addEventListener('click', () => {
    const laplacianData = edgeManager.laplacian(storage.imageData);

    console.log(laplacianData);

    GlobalExp2plus.setImageData(laplacianData, laplacianData);
  });

  iterativeThresholdingBtn.addEventListener('click', () => {
    const iterativeThresholdingData = edgeManager.iterativeThresholding(storage.imageData);

    console.log(iterativeThresholdingData);

    GlobalExp2plus.setImageData(iterativeThresholdingData, iterativeThresholdingData);
  });

  regionGrowingBtn.addEventListener('click', () => {
    const regionGrowingData = edgeManager.regionGrowing(storage.imageData, [4, 1], 50);

    console.log(regionGrowingData);

    GlobalExp2plus.setImageData(regionGrowingData, regionGrowingData);
  });

  imgInput.addEventListener('click', (e) => {
    const { ctrlKey, layerX, layerY } = e;
    if (ctrlKey === true) {
      const ratio = calcScaleRatio();
      const x = layerX - xDis;
      const y = layerY - yDis;
      const imageData = edgeManager.runRegionGrowingOnPoint(x, y, 20, ratio, storage.imageData);

      console.log(imageData);

      GlobalExp2plus.setImageData(imageData, imageData);
    }
  });

  return update;
}
