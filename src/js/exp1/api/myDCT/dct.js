
const _ = {
  cu(u, N) {
    return u === 0 ? Math.sqrt(1 / N) : Math.sqrt(2 / N);
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
};

const dct = (array) => {
  const i = _.cal(array);
  // console.log(i);
  return i;
};

const idct = (array) => {

};

export default {
  dct,
  idct,
};
