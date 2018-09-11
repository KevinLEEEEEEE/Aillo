import fft from './fft';

export default function fft2(array, width, height) {
  for (let index = 0; index < height; index += 1) {
    array[index] = fft(array[index]); // 每一行都做傅里叶变换
  }

  console.log(array);

  // for (let i = 0; i < width; i += 1) {
  //   let tmp = [];

  //   for (let j = 0; j < height; j += 1) {
  //     tmp[j] = array[j][i];
  //   }

  //   tmp = fft(tmp);

  //   for (let j = 0; j < height; j += 1) {
  //     array[j][i] = tmp[j];
  //   }
  // }

  // const test1 = [0, 1, 2, 3, 4, 5, 6, 7];

  // const test2 = [1, 3, 2, 5, 8, 4, 1, 3,
  //   2, 5, 8, 4, 1, 3, 2, 5,
  //   8, 4, 1, 3, 2, 5, 8, 4,
  //   1, 3, 2, 5, 8, 4, 1, 3,
  //   2, 5, 8, 4, 1, 3, 2, 5,
  //   8, 4, 1, 3, 2, 5, 8, 4,
  //   1, 3, 2, 5, 8, 4, 1, 3,
  //   2, 5, 8, 4, 1, 3, 2, 5];

  //  console.log(array);

  return array;
}
