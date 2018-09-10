

const matrixManager = {
  oneDimensionToTwo(array, width, height) {
    const tmpArray = [];

    for (let i = 0; i < width; i += 1) {
      tmpArray[i] = [];
      for (let j = 0; j < height; j += 1) {
        tmpArray[i][j] = array[i * width + j];
      }
    }

    return tmpArray;
  },
};

export default matrixManager;
