import fft from './fft';

export default function fft2(array, width, height) {
  for (let index = 0; index < height; index += 1) {
    array[index] = fft(array[index]); // 每一行都做傅里叶变换
  }

  for (let i = 0; i < width; i += 1) {
    let tmp = [];

    for (let j = 0; j < height; j += 1) {
      tmp[j] = array[j][i];
    }

    tmp = fft(tmp);

    for (let j = 0; j < height; j += 1) {
      array[j][i] = tmp[j];
    }
  }

  console.log(array);
  // const test = [1, 3, 2, 5, 8, 4, 1, 3,
  //   2, 5, 8, 4, 1, 3, 2, 5,
  //   8, 4, 1, 3, 2, 5, 8, 4,
  //   1, 3, 2, 5, 8, 4, 1, 3,
  //   2, 5, 8, 4, 1, 3, 2, 5,
  //   8, 4, 1, 3, 2, 5, 8, 4,
  //   1, 3, 2, 5, 8, 4, 1, 3,
  //   2, 5, 8, 4, 1, 3, 2, 5];
}
