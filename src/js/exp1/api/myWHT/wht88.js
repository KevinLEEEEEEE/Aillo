import whts from './wht';

const _ = {
  pos(index, w) {
    const x = index % w;
    const y = Math.floor(index / w);

    return { x, y };
  },

  formatArray(array, w, h, targetSize) {
    const tmp = [];

    for (let i = 0, j = targetSize ** 2; i < j; i += 1) {
      const { x, y } = this.pos(i, targetSize);

      if (x >= w || y >= h) {
        tmp.push(0);
      } else {
        tmp.push(array[y * w + x]);
      }
    }

    return tmp;
  },

  iformatArray(array, w, h, targetSize) {
    const tmp = [];

    for (let i = 0, j = targetSize ** 2; i < j; i += 1) {
      const { x, y } = this.pos(i, targetSize);

      if (x < w && y < h) {
        tmp.push(array[i]);
      }
    }

    return tmp;
  },

  completeLen(len) {
    const log2X = Math.log(len) / Math.log(2);
    return 1 << Math.ceil(log2X);
  },
};

const wht88 = (array, w, h) => {
  const length = _.completeLen(Math.max(w, h));
  const formattedArray = _.formatArray(array, w, h, length);
  const whtedArray = whts.wht2(formattedArray).map(val => Math.abs(val));
  const iformattedArray = _.iformatArray(whtedArray, w, h, length);

  return iformattedArray;
};

export default {
  wht88,
  wht: whts.wht,
  wht2: whts.wht2,
};
