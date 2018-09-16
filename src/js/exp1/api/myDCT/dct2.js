import dcts from './dct';

const dct2 = (array, width, height) => {
  const tmp = [];

  for (let i = 0; i < height; i += 1) {
    const hFragment = array.slice(i * width, (i + 1) * width);
    const dctedArray = dcts.dct(hFragment);

    dctedArray.forEach(value => tmp.push(value));
  }

  for (let i = 0; i < width; i += 1) {
    const vFragment = [];

    for (let j = 0; j < height; j += 1) {
      vFragment.push(tmp[j * width + i]);
    }

    const dctedArray = dcts.dct(vFragment);

    for (let j = 0; j < height; j += 1) {
      tmp[j * width + i] = dctedArray[j];
    }
  }
  console.log(tmp);
  return tmp;
};

const idct2 = (array, width, height) => {

};

export default {
  dct2,
  idct2,
};
