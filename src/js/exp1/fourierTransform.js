import GlobalExp1 from './Global_exp1';
import fft2s from './api/myFFT/fft2';
import logger from '../utils/logger';

const FSM = {
  none: 0,
  trans: 1,
  itrans: 2,
  err: 3,
};

const _ = {
  zoom(array, limit) {
    const cc = 9e-3;
    const max = Math.max(...array);
    const limitedMax = Math.log(max * cc + 1);

    return array.map((value) => {
      const color = Math.log(cc * value + 1);

      return Math.round(color * limit / limitedMax);
    });
  },

  displace(array, w, h, matrix, mw, mh) {
    const blockSize = array.length / (mw * mh);
    const blockW = w / mw;
    const blockH = h / mh;
    const displaceList = [];
    const tmp = [];

    const position = (p, i) => {
      const vB = Math.floor(p / mw);
      const hB = p - vB * mw;
      const vS = Math.floor(i / blockW);
      const hS = i - vS * blockW;

      const vBefore = vB * blockH + vS;
      const hBefore = hB * blockW + hS;

      return vBefore * w + hBefore;
    };

    matrix.forEach((value, index, arr) => {
      if (value !== -1 && value !== index) {
        displaceList.push([index, value]);
        arr[value] = -1;
      }
    });

    displaceList.forEach((value) => {
      const a1 = value[0];
      const a2 = value[1];

      for (let i = 0; i < blockSize; i += 1) {
        const p1 = position(a1, i);
        const p2 = position(a2, i);

        tmp[p1] = array[p2];
        tmp[p2] = array[p1];
      }
    });

    return tmp;
  },

  convertPluralToArray(array) {
    return array.map(value => value.magnitude2());
  },

  fft({ data, width, height }) {
    logger.info('', '------- Start running fft2 -------');

    const fft2Array = fft2s.fft2(data, width, height);

    logger.info('calculate fft2 [√]');

    const spectrum = _.convertPluralToArray(fft2Array);
    const zoomedArray = _.zoom(spectrum, 255);

    logger.info('spectrum and zoom data [√]');

    const displacedArray = _.displace(zoomedArray, width, height, [3, 2, 1, 0], 2, 2);

    logger.info('mosaic image to center [√]');

    GlobalExp1.setColorData(displacedArray, 'tff');

    logger.info('-------- End running fft2 --------', '');

    return fft2Array;
  },

  ifft({ data, width, height }) {
    logger.info('', '------- Start running ifft2 -------');

    const ifft2Array = fft2s.ifft2(data, width, height);

    logger.info('calculate ifft2 [√]');

    const regressedArray = fft2s.regress(ifft2Array, width, height);

    logger.info('regress data [√]');

    GlobalExp1.setColorData(regressedArray, 'ifft');

    logger.info('-------- End running ifft2 --------', '');

    return regressedArray;
  },
};

export default function fourierransform() {
  const fft = document.getElementById('fft');
  const ifft = document.getElementById('ifft');
  let state = FSM.none;
  let storage = null;

  const update = () => {
    state = FSM.none;
  };

  fft.addEventListener('click', () => {
    switch (state) {
    case FSM.none:
      storage = GlobalExp1.getColorData();
      if (storage.data === undefined) {
        break;
      }
    case FSM.itrans: {
      const fft2Array = _.fft(storage);

      storage.data = fft2Array;
      state = FSM.trans;
    }
      break;
    case FSM.trans:
      alert('Please run ifft before running fft');
      break;
    case FSM.err:
      break;
    default:
    }
  });

  ifft.addEventListener('click', () => {
    switch (state) {
    case FSM.none:
    case FSM.itrans:
      alert('Please run fft before running ifft');
      break;
    case FSM.trans: {
      const ifft2Array = _.ifft(storage);

      storage.data = ifft2Array;
      state = FSM.itrans;
    }
      break;
    case FSM.err:
      break;
    default:
    }
  });

  return update;
}
