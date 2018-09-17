
const _ = {
  cu(u, v) {
    if (u === 0 && v === 0) {
      return 1 / 2;
    } if (u === 0 || v === 0) {
      return 1 / Math.sqrt(2);
    }
    return 1;
  },

  factorLut(m, n, x, y, u, v) {
    const factor = (a, b, c) => Math.cos((a + 0.5) * b * Math.PI / c);

    return factor(x, u, m) * factor(y, v, n);
  },

  pos(index, w) {
    const x = index % w;
    const y = Math.floor(index / w);

    return { x, y };
  },

  cal(array, w, h, isReverse) {
    const factor = 2 / Math.sqrt(w * h);

    return array.map((val, i) => {
      const { x: u, y: v } = _.pos(i, w);
      const reducer = (prev, value, index) => {
        const { x, y } = _.pos(index, w);

        if (isReverse === true) {
          return prev + value * _.cu(x, y) * _.factorLut(w, h, u, v, x, y);
        }

        return prev + value * _.cu(u, v) * _.factorLut(w, h, x, y, u, v);
      };

      return factor * array.reduce(reducer, 0);
    });
  },
};

const dct = (array, w = array.length, h = 1) => {
  const res = _.cal(array, w, h, false);

  // console.log(res);

  return res;
};

const idct = (array, w = array.length, h = 1) => {
  const res = _.cal(array, w, h, true);

  // console.log(res);

  return res;
};

export default {
  dct,
  idct,
  pos: _.pos,
};
