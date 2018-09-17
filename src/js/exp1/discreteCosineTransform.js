import dcts from './api/myDCT/dct';
import dct88s from './api/myDCT/dct88';

export default function discreteCosineTransform() {
  // dcts.dct([0, 0, 2, 2, 2, 2, 0, 0]);
  // const i = dcts.dct([42, 66, 68, 66,
  //   92, 4, 76, 17,
  //   79, 85, 74, 71,
  //   96, 93, 39, 3], 4, 4);


  const tmp = [];
  const tmp1 = [0, 1, 0, 0, 0, 0, 0, 0,
    2, 3, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0];

  for (let i = 0; i < 4; i += 1) {
    tmp.push(i);
  }
  dct88s.dct88(tmp, 2, 2);

  const r = dcts.dct(tmp1, 8, 8);

  console.log(r);
}
