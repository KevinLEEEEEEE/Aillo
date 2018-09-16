import dcts from './api/myDCT/dct';
import dct2s from './api/myDCT/dct2';

export default function discreteCosineTransform() {
  // console.log(dcts.dct([0, 0, 2, 2, 2, 2, 0, 0]));
  dcts.dct([42, 66, 68, 66,
    92, 4, 76, 17,
    79, 85, 74, 71,
    96, 93, 39, 3], 4, 4);

  // dcts.dct()
}
