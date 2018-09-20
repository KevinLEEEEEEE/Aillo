const BASICTABLE = [1, 1, 1, -1];

const HADAMARDTABLE = [
  1, 1, 1, 1, 1, 1, 1, 1,
  1, -1, 1, -1, 1, -1, 1, -1,
  1, 1, -1, -1, 1, 1, -1, -1,
  1, -1, -1, 1, 1, -1, -1, 1,
  1, 1, 1, 1, -1, -1, -1, -1,
  1, -1, 1, -1, -1, 1, -1, 1,
  1, 1, -1, -1, -1, -1, 1, 1,
  1, -1, -1, 1, -1, 1, 1, -1,
];

const _ = {
  pos(index, w) {
    const x = index % w;
    const y = Math.floor(index / w);

    return { x, y };
  },

  grayCode(n) {
    return n ^ (n >> 1);
  },

  hadamard(n) {
    if (!Reflect.has(this, `hadamard${n}`)) {
      const pos = [[0, 0], [0, 1], [1, 0], [1, 1]];

      const hadaFun = (array) => {
        if (array[0] === 1) {
          return array;
        }

        const length = Math.sqrt(array.length);
        const cLength = 2 * length;
        const tmp = [];

        array.forEach((value, index) => {
          const { x, y } = this.pos(index, length);
          const m = BASICTABLE.map(v => v * value / 2);

          for (let i = 0, len = pos.length; i < len; i += 1) {
            const xBefore = x * 2 + pos[i][0];
            const yBefore = y * 2 + pos[i][1];
            const targetIndex = yBefore * cLength + xBefore;

            tmp[targetIndex] = m[i];
          }
        });

        return hadaFun(tmp);
      };

      this[`hadamard${n}`] = hadaFun([n]);
    }

    return this[`hadamard${n}`];
  },

  matrixMul(a, aw, ah, b, bw, bh) {
    const tmp = [];

    for (let i = 0; i < ah; i += 1) {
      for (let j = 0; j < bw; j += 1) {
        let result = 0;

        for (let m = 0; m < aw; m += 1) {
          const lv = a[i * aw + m];
          const rv = b[m * bw + j];

          result += lv * rv;
        }

        tmp.push(result);
      }
    }

    return {
      value: tmp,
      width: bw,
      height: ah,
    };
  },
};

const wht = (array) => {
  // const { length } = array;
  // const sLength = Math.sqrt(length);
  // const hadamardArray = _.hadamard(sLength);

  // const mul = _.matrixMul(hadamardArray, sLength, sLength, array, 1, length);

  const test = _.matrixMul([2, 1, -1, 1], 4, 1, [2, 2, 1, 3], 1, 4);
  console.log(test);
};

const iwht = () => {

};

export default {
  wht,
  iwht,
};
