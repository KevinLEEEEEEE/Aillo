
const matrixManager = {
  oneDimensionToTwo(array, width, height) {
    const tmpArray = [];

    for (let i = 0; i < height; i += 1) {
      tmpArray[i] = [];
      for (let j = 0; j < width; j += 1) {
        tmpArray[i][j] = array[i * width + j];
      }
    }

    return tmpArray;
  },

  twoDimensionsToOne(array, width, height) {
    const tmp = [];

    for (let i = 0; i < height; i += 1) {
      for (let j = 0; j < width; j += 1) {
        tmp.push(array[i][j]);
      }
    }

    return tmp;
  },

  convertArrayToPlural(array) {
    return array.map((value) => {
      if (typeof value === 'object') {
        return value;
      }

      return { real: value, imag: 0 };
    });
  },

  convertPluralToArray(array) {
    return array.map((value) => {
      if (typeof value === 'number') {
        return value;
      }

      return Math.sqrt((value.real ** 2) + (value.imag ** 2));
    });
  },

  zoom(array, max) {
    let biggest = 0;

    array.forEach((element) => {
      if (element > biggest && element < 10000) {
        biggest = element;
      }
    });

    return array.map(value => value / biggest * max);
  },

  // convertArrayToUint8ClampedArray(array) {
  //   return new Uint8ClampedArray(array);
  // },
};

export default matrixManager;
