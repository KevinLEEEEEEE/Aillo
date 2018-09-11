import matrixManager from './matrixManager';

const PI2 = Math.PI * 2;

const _fft = {
  mul(a, b) {
    return {
      real: a.real * b.real - a.imag * b.imag,
      imag: a.real * b.imag + a.imag * b.real,
    };
  },

  add(a, b) {
    return {
      real: a.real + b.real,
      imag: a.imag + b.imag,
    };
  },

  sub(a, b) {
    return {
      real: a.real - b.real,
      imag: a.imag - b.imag,
    };
  },

  reverse(array) {
    const { length } = array;
    const log2X = Math.log(length) / Math.log(2);
    let k = 0;
    let j = 0;
    let tmp = null;

    for (let i = 0; i < length; i += 1) {
      k = i;
      j = 0;

      for (let t = 0; t < log2X; t += 1) {
        j <<= 1;
        j |= (k & 1);
        k >>= 1;
      }

      if (j > i) {
        tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
      }
    }
  },

  factor(count) {
    if (!Reflect.has(this, `factor${count}`)) {
      const tmp = [];

      for (let index = 0; index < count; index += 1) {
        const angle = index * PI2 / count;
        tmp.push({
          real: Math.cos(angle),
          imag: -Math.sin(angle),
        });
      }

      this[`factor${count}`] = tmp;
    }

    return this[`factor${count}`];
  },
};

export default function fft(array) {
  const { length } = array;
  const log2X = Math.log(length) / Math.log(2);
  const factor = _fft.factor(length);

  _fft.reverse(array);

  array = matrixManager.convertArrayToPlural(array);

  let l;
  let xW;
  let top;
  let bottom;

  for (let i = 0; i < log2X; i += 1) { // 枚举到哪一层
    l = 1 << i;
    for (let j = 0; j < length; j += 2 * l) { // 枚举合并区间
      for (let k = 0; k < l; k += 1) { // 枚举下标
        xW = _fft.mul(array[j + k + l], factor[length / (2 * l) * k]);
        top = _fft.add(array[j + k], xW);
        bottom = _fft.sub(array[j + k], xW);
        array[j + k] = top;
        array[j + k + l] = bottom;
      }
    }
  }

  return array;
}
