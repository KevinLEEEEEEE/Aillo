import dcts from './dct';

const BLOCKSIZE = 8;

const QUANTITATIVETABLE = [
  16, 11, 10, 16, 24, 40, 51, 61,
  12, 12, 14, 19, 26, 58, 60, 55,
  14, 13, 16, 24, 40, 57, 69, 56,
  14, 17, 22, 29, 51, 87, 80, 62,
  18, 22, 37, 56, 68, 109, 103, 77,
  24, 35, 55, 64, 81, 104, 113, 92,
  49, 64, 78, 87, 103, 121, 120, 101,
  72, 92, 95, 98, 112, 100, 103, 99,
];

const _ = {
  splitArray(array, w, h) {
    const hBlock = Math.ceil(w / BLOCKSIZE);
    const vBlock = Math.ceil(h / BLOCKSIZE);
    const totalBlock = hBlock * vBlock;
    const splittedArray = [];

    for (let i = 0; i < totalBlock; i += 1) {
      const tmp = [];
      const { x: x1, y: y1 } = dcts.pos(i, hBlock);

      for (let j = 0; j < BLOCKSIZE * BLOCKSIZE; j += 1) {
        const { x: x2, y: y2 } = dcts.pos(j, BLOCKSIZE);
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
      const { x: x1, y: y1 } = dcts.pos(i, hBlock);

      val.forEach((v, j) => {
        const { x: x2, y: y2 } = dcts.pos(j, BLOCKSIZE);
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

  quantifyArray(array, scale = 2) {
    return array.map((value, index) => scale * Math.round(value / QUANTITATIVETABLE[index]));
  },
};

const dct88 = (array, w, h) => {
  const splittedArray = _.splitArray(array, w, h);
  const dctedArray = splittedArray.map(val => dcts.dct(val, BLOCKSIZE, BLOCKSIZE));
  const quantifiedArray = dctedArray.map(value => _.quantifyArray(value, 2));
  const mergedArray = _.mergeArray(quantifiedArray, w, h);

  return mergedArray;
};

const idct88 = (array, w, h) => {

};

export default {
  dct88,
  idct88,
  dct: dcts.dct,
  idct: dcts.idct,
};
