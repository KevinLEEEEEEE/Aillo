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
};

const wht88 = (array, w, h) => {
  const splittedArray = _.splitArray(array, w, h);
  const whtedArray = splittedArray.map(value => whts.wht2(value));
  console.log(whtedArray);
  const mergedArray = _.mergeArray(whtedArray, w, h);

  return mergedArray;
};

export default {
  wht88,
  wht: whts.wht,
  wht2: whts.wht2,
};
