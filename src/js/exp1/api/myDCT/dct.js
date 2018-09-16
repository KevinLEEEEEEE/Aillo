
const _ = {
  cu(u, N) {
    return u === 0 ? Math.sqrt(1 / N) : Math.sqrt(2 / N);
  },

  cu2D(u, v) {
    if (u === 0 && v === 0) {
      return 1 / 2;
    } if (u === 0 || v === 0) {
      return 1 / Math.sqrt(2);
    }
    return 1;
  },

  factorLut(len) {
    if (!Reflect.has(this, `factorLut${len}`)) {
      const tmp = [];

      for (let u = 0; u < len; u += 1) {
        for (let i = 0; i < len; i += 1) {
          const value = Math.cos((i + 0.5) * Math.PI * u / len);

          tmp.push(value);
        }
      }

      this[`factorLut${len}`] = tmp;
    }

    return this[`factorLut${len}`];
  },

  factorLut2D(m, n, x, y, u, v) {
    const factor = (a, b, c) => Math.cos((a + 0.5) * b * Math.PI / c);

    return factor(x, u, m) * factor(y, v, n);
  },

  pos2D(index, w) {
    const x = index % w;
    const y = Math.floor(index / w);

    return { x, y };
  },

  cal(array) {
    const { length } = array;
    const factorLut = _.factorLut(length);

    const result = array.map((value, u, arr) => {
      const cu = _.cu(u, length);
      const sum = arr.reduce((prev, val, j) => prev + val * factorLut[u * length + j]);

      return cu * sum;
    });

    return result;
  },

  cal2D(array, w, h) {
    const factor = 2 / Math.sqrt(w * h);

    return array.map((val, i) => {
      const { x: u, y: v } = _.pos2D(i, w);
      const reducer = (prev, currentValue, index) => {
        const { x, y } = _.pos2D(index, w);

        return prev + currentValue * _.cu2D(u, v) * _.factorLut2D(w, h, x, y, u, v);
      };

      return factor * array.reduce(reducer, 0);
    });
  },

  cal2D88(array) {
    return _.cal2D(array, 8, 8);
  },
};

const dct = (array, w, h) => {
  // const i = _.cal(array);

  // return i;

  const res = _.cal2D(array, w, h);
  console.log(res);

  return res;
};

const idct = (array) => {

};

export default {
  dct,
  idct,
};
