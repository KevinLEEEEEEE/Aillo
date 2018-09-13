import ffts from './fft';

const fft2 = (array, width, height) => {
  const tmp = [];

  for (let i = 0; i < height; i += 1) {
    const hFragment = array.slice(i * width, (i + 1) * width);

    const fftedArray = ffts.fft(hFragment);

    fftedArray.forEach(value => tmp.push(value));
  }

  for (let i = 0; i < width; i += 1) {
    const vFragment = [];

    for (let j = 0; j < height; j += 1) {
      vFragment.push(tmp[j * width + i]);
    }
    const fftedArray = ffts.fft(vFragment);

    for (let j = 0; j < height; j += 1) {
      tmp[j * width + i] = fftedArray[j];
    }
  }

  return tmp;
};

const ifft2 = (array, width, height) => {
  const tmp = [];

  for (let i = 0; i < height; i += 1) {
    const hFragment = array.slice(i * width, (i + 1) * width);

    const fftedArray = ffts.ifft(hFragment);

    fftedArray.forEach(value => tmp.push(value));
  }

  for (let i = 0; i < width; i += 1) {
    const vFragment = [];

    for (let j = 0; j < height; j += 1) {
      vFragment.push(tmp[j * width + i]);
    }
    const fftedArray = ffts.ifft(vFragment);

    for (let j = 0; j < height; j += 1) {
      tmp[j * width + i] = fftedArray[j];
    }
  }

  return tmp;
};

export default {
  fft: ffts.fft,
  ifft: ffts.ifft,
  fft2,
  ifft2,
};
