import dcts from './api/myDCT/dct';

export default function discreteCosineTransform() {
  dcts.dct([0, 0, 2, 2, 2, 2, 0, 0]);
}
