import dcts from './api/myDCT/dct';
import dct2s from './api/myDCT/dct88';

export default function discreteCosineTransform() {
  dcts.dct([0, 0, 2, 2, 2, 2, 0, 0]);
  const i = dcts.dct([42, 66, 68, 66,
    92, 4, 76, 17,
    79, 85, 74, 71,
    96, 93, 39, 3], 4, 4);
  dcts.idct(i, 4, 4);
}
