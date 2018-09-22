import GlobalExp1 from './Global_exp1';
import wht88s from './api/myWHT/wht88';
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

  wht({ data, width, height }) {
    logger.info('', '------- Start running wht88 -------');

    const wht88Array = wht88s.wht88(data, width, height);

    logger.info('calculate wht88 [√]');

    logger.info('-------- End running wht88 --------', '');

    return wht88Array;
  },

  whtZoom(data, scale) {
    const zoomedArray = data.map(value => value * scale);

    GlobalExp1.setColorData(zoomedArray, 'wht');

    logger.info(`scale and display zoomed by: ${scale} [√]`);
  },

  iwht() {
    logger.info('', '------- Start running iwht88 -------');

    const iwht88Array = GlobalExp1.getColorData().data;

    GlobalExp1.setColorData(iwht88Array, 'iwht');

    logger.info('', '------- Start running iwht88 -------');

    return iwht88Array;
  },
};

export default function WalahHadamardTrans() {
  const wht = document.getElementById('wht');
  const iwht = document.getElementById('iwht');
  const whtEnlarge = document.getElementById('whtEnlarge');
  const whtNarrow = document.getElementById('whtNarrow');
  const whtScale = document.getElementById('whtScale');
  let storage = null;
  let scale = 255;
  let state = FSM.none;

  const update = () => {
    state = FSM.none;
  };

  wht.addEventListener('click', () => {
    switch (state) {
    case FSM.none:
      storage = GlobalExp1.getColorData();
      if (storage.data === undefined) {
        break;
      }
    case FSM.itrans: {
      const wht88Array = _.wht(storage);

      _.whtZoom(wht88Array, 255);

      storage.data = wht88Array;
      state = FSM.trans;
    }
      break;
    case FSM.trans:
      alert('Please run iwht before running wht');
      break;
    case FSM.err:
      break;
    default:
    }
  });

  whtEnlarge.addEventListener('click', () => {
    switch (state) {
    case FSM.none:
      alert('Please run wht before changing the scale value');
      break;
    case FSM.itrans:
      alert('Only available after running wht');
      break;
    case FSM.trans:
      _.whtZoom(storage.data, scale += 50);
      whtScale.innerHTML = scale;
      break;
    case FSM.err:
      break;
    default:
    }
  });

  whtNarrow.addEventListener('click', () => {
    switch (state) {
    case FSM.none:
      alert('Please run wht before changing the scale value');
      break;
    case FSM.itrans:
      alert('Only available after running wht');
      break;
    case FSM.trans:
      _.whtZoom(storage.data, scale -= 50);
      whtScale.innerHTML = scale;
      break;
    case FSM.err:
      break;
    default:
    }
  });


  iwht.addEventListener('click', () => {
    switch (state) {
    case FSM.none:
    case FSM.itrans:
      alert('Please run dct before running idct');
      break;
    case FSM.trans: {
      const iwht88Array = _.iwht();

      storage = iwht88Array;
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
