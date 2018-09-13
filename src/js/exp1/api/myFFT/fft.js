
const complex = (real, imag) => {
  const comp = Object.create({
    mul(c) {
      if (typeof c === 'object') {
        const rPart = this.real * c.real - this.imag * c.imag;
        const iPart = this.real * c.imag + this.imag * c.real;

        return complex(rPart, iPart);
      }

      return complex(this.real * c, this.imag * c);
    },

    add(c) {
      return complex(this.real + c.real, this.imag + c.imag);
    },

    sub(c) {
      return complex(this.real - c.real, this.imag - c.imag);
    },

    magnitude() {
      return (this.real ** 2) + (this.imag ** 2);
    },

    magnitude2() {
      return Math.sqrt(this.magnitude2());
    },

    conjugate() {
      return complex(this.real, -this.imag);
    },
  });

  comp.real = real;
  comp.imag = imag;

  return comp;
};

const _ = {
  reverse(array) {
    const { length } = array;
    const log2X = Math.log(length) / Math.log(2);
    let k = 0;
    let j = 0;

    for (let i = 0; i < length; i += 1) {
      k = i;
      j = 0;

      for (let t = 0; t < log2X; t += 1) {
        j <<= 1;
        j |= (k & 1);
        k >>= 1;
      }

      if (j > i) {
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    return array;
  },

  factorLut(len) {
    if (!Reflect.has(this, `factorLut${len}`)) {
      const tmp = [];

      for (let i = 0; i < len; i += 1) {
        const angle = -i * Math.PI * 2 / len; // 2π rad = 360°
        tmp.push(complex(Math.cos(angle), Math.sin(angle)));
      }

      this[`factorLut${len}`] = tmp;
    }

    return this[`factorLut${len}`];
  },

  log2X(x) {
    return Math.log(x) / Math.log(2);
  },

  completeLen(len) {
    return 1 << Math.ceil(_.log2X(len));
  },

  formattedArray(array) {
    const { length } = array;
    const len = _.completeLen(length);
    const tmp = [];

    for (let i = 0; i < length; i += 1) {
      tmp.push(complex(array[i], 0));
    }

    for (let i = length; i < len; i += 1) {
      tmp.push(0, 0);
    }

    return tmp;
  },

  butterfly(formattedArray) {
    const { length } = formattedArray;
    const log2X = _.log2X(length);
    const factorLut = _.factorLut(length);
    const reversedArray = _.reverse(formattedArray);

    for (let i = 0; i < log2X; i += 1) { // 每一次奇偶分割形成新的层
      const sizeOfUnit = 2 * (1 << i);

      for (let j = 0; j < length; j += sizeOfUnit) { // 遍历一层内所有的块，j为第几单元
        for (let k = 0; k < sizeOfUnit / 2; k += 1) { // 块内蝴蝶运算，k为单元内位置
          const a0 = j + k;
          const a1 = j + k + sizeOfUnit / 2;
          const xW = reversedArray[a1].mul(factorLut[length / sizeOfUnit * k]);
          const top = reversedArray[a0].add(xW);
          const bottom = reversedArray[a0].sub(xW);

          reversedArray[a0] = top;
          reversedArray[a1] = bottom;
        }
      }
    }

    return reversedArray;
  },
};

const fft = (array) => {
  const formattedArray = _.formattedArray(array);
  const fftedArray = _.butterfly(formattedArray);

  return fftedArray;
};

const ifft = (array) => {
  let conjugatedArray = array.map(value => value.conjugate());
  const fftedArray = _.butterfly(conjugatedArray);
  conjugatedArray = fftedArray.map(value => value.conjugate());

  const { length } = array;
  return conjugatedArray.map((value) => {
    const val = value.mul(1 / length);

    return val.real;
  });
};

export default {
  Complex: complex,
  fft,
  ifft,
};
