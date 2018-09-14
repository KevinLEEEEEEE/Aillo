import ffts from './fft';

const cal = (array, width, height, cw, ch, isReverse) => {
  const tmp = [];

  for (let i = 0; i < height; i += 1) {
    const hFragment = array.slice(i * width, (i + 1) * width);
    const fftedArray = isReverse ? ffts.ifft(hFragment, cw) : ffts.fft(hFragment);

    fftedArray.forEach(value => tmp.push(value));
  }

  console.log(tmp);

  const cWidth = tmp.length / height;

  for (let i = 0; i < cWidth; i += 1) {
    const vFragment = [];

    for (let j = 0; j < height; j += 1) {
      vFragment.push(tmp[j * cWidth + i]);
    }

    const fftedArray = isReverse ? ffts.ifft(vFragment, ch) : ffts.fft(vFragment);
    const { length } = fftedArray;

    for (let j = 0; j < length; j += 1) {
      tmp[j * cWidth + i] = fftedArray[j];
    }
  }

  const gap = cw * height - cw * ch;
  if (gap > 0) {
    tmp.splice(cw * ch, gap);
  }

  return tmp;
};

const fft2 = (array, width, height) => cal(array, width, height, 0, 0, false);

const ifft2 = (array, width, height) => {
  const cWidth = ffts.completeLen(width);
  const cHeight = ffts.completeLen(height);
  const ifftedArray = cal(array, cWidth, cHeight, width, height, true);

  return ifftedArray;
};

const regress = (array, width, height) => {
  const cAmount = ffts.completeLen(width * height);
  return array.map(value => value.regress(cAmount));
};

export default {
  fft: ffts.fft,
  ifft: ffts.ifft,
  fft2,
  ifft2,
  regress,
};
