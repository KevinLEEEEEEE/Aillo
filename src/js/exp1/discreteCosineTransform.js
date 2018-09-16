import dcts from './api/myDCT/dct';
import dct2s from './api/myDCT/dct2';

export default function discreteCosineTransform() {
  dcts.dct([0, 0, 2, 2, 2, 2, 0, 0]);
  dct2s.dct2([61, 19, 50, 20,
    82, 26, 61, 45,
    89, 90, 82, 43,
    93, 59, 53, 97], 4, 4);
}
