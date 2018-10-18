import { blankImageData, pos } from './utils';

export default function averageData(imageData, average) {
  const { data, width, height } = imageData;
  const blankData = blankImageData(width, height);

  for (let i = 0, j = data.length / 4; i < j; i += 1) {
    const { x: tx, y: ty } = pos(i, width);
    const b1 = -(average - 1) / 2;
    const b2 = -b1;
    const tmp = [];

    for (let m = b1; m <= b2; m += 1) {
      for (let n = b1; n <= b2; n += 1) {
        const cx = tx + n;
        const cy = ty + m;

        if (cx >= 0 && cx < width && cy >= 0 && cy < height) {
          const index = cy * width + cx;
          const value = data[index * 4];

          tmp.push(value);
        }
      }
    }

    const sorted = tmp.sort();

    const finalValue = sorted.length % 2 === 1
      ? sorted[(tmp.length - 1) / 2] : sorted[tmp.length / 2];

    blankData.data[i * 4] = finalValue;
    blankData.data[i * 4 + 1] = finalValue;
    blankData.data[i * 4 + 2] = finalValue;
    blankData.data[i * 4 + 3] = data[i * 4 + 3];
  }

  return blankData;
}
