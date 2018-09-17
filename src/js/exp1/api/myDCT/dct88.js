import dcts from './dct';

const BLOCKSIZE = 8;

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
};

const dct88 = (array, w, h) => {
  const splittedArray = _.splitArray(array, w, h);
  const dctedArray = splittedArray.map(val => dcts.dct(val, BLOCKSIZE, BLOCKSIZE));
  const mergedArray = _.mergeArray(dctedArray, w, h);
  console.log(mergedArray);
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
