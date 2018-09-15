
const _ = {
  factorLut(len) {
    if (!Reflect.has(this, `factorLut${len}`)) {

    }

    return this[`factorLut${len}`];
  },
};

const dct = (array) => {
  const factorLut = _.factorLut();
};

const idct = (array) => {

};

export default {
  dct,
  idct,
};
