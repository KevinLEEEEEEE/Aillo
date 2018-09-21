import whts from './wht';

const BLOCKSIZE = 8;

const _ = {
  splitArray(array, w, h) {
    const hBlock = Math.ceil(w / BLOCKSIZE);
    const vBlock = Math.ceil(h / BLOCKSIZE);
    const totalBlock = hBlock * vBlock;
    const splittedArray = [];

    for (let i = 0; i < totalBlock; i += 1) {
      const tmp = [];
      const { x: x1, y: y1 } = whts.pos(i, hBlock);

      for (let j = 0; j < BLOCKSIZE * BLOCKSIZE; j += 1) {
        const { x: x2, y: y2 } = whts.pos(j, BLOCKSIZE);
        const x = x1 * BLOCKSIZE + x2;
        const y = y1 * BLOCKSIZE + y2;

        if (x >= w || y >= h) {
          tmp.push(0);
        } else {
          tmp.push(array[y * w + x]);
        }
      }

      splittedArray.push(tmp);
    }

    return splittedArray;
  },

  mergeArray(array, w, h) {
    const hBlock = Math.ceil(w / BLOCKSIZE);
    const mergedArray = [];

    array.forEach((val, i) => {
      const { x: x1, y: y1 } = whts.pos(i, hBlock);

      val.forEach((v, j) => {
        const { x: x2, y: y2 } = whts.pos(j, BLOCKSIZE);
        const x = x1 * BLOCKSIZE + x2;
        const y = y1 * BLOCKSIZE + y2;

        if (x < w && y < h) {
          const xx = x1 * BLOCKSIZE + x2;
          const yy = y1 * BLOCKSIZE + y2;
          const index = yy * w + xx;

          mergedArray[index] = v;
        }
      });
    });

    return mergedArray;
  },

  completeLen(len) {
    const log2X = Math.log(len) / Math.log(2);
    return 1 << Math.ceil(log2X);
  },
};

const wht88 = (array, w, h) => {
  const length = _.completeLen(Math.max(w, h));
  const whtedArray = whts.wht2(array).map(val => Math.abs(val));

  return whtedArray;
};

export default {
  wht88,
  wht: whts.wht,
  wht2: whts.wht2,
};
