const BASICTABLE = [
  1, 1,
  1, -1,
];

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
    const hadaFun = (array) => {
      const currentValue = array[0];

      if (currentValue === 1) {
        return array;
      }

      // if (currentValue === 1) {
      //   return array;
      // }

      const len = Math.sqrt(array.length);
      const completeLen = 2 * len;
      const tmp = [];

      array.forEach((value, index) => {
        const { x, y } = this.pos(index, len);
        const targetPos = [0, 1, 2, 3];
        const targetValue = value / 2;

        targetPos.forEach((pos, i) => {
          const { x: x1, y: y1 } = this.pos(i, 2);

          const xBefore = x * 2 + x1;
          const yBefore = y * 2 + y1;
          const targetIndex = yBefore * completeLen + xBefore;

          tmp[targetIndex] = targetValue;

          if (i === 3) {
            tmp[targetIndex] = -tmp[targetIndex];
          }
        });
      });

      console.log(tmp);

      return hadaFun(tmp);
    };


    return hadaFun([n]);
  },
};

const wht = () => {
  console.log(_.hadamard(8));
};

const iwht = () => {

};

export default {
  wht,
  iwht,
};
