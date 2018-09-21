import GlobalExp1 from './Global_exp1';
import dct88s from './api/myDCT/dct88';
import logger from '../utils/logger';

const FSM = {
  none: 0,
  trans: 1,
  itrans: 2,
  err: 3,
};

const _ = {
  dct({ data, width, height }) {
    logger.info('', '------- Start running dct88 -------');

    const dct88Array = dct88s.dct88(data, width, height);

    logger.info('calculate dct88 [√]');

    GlobalExp1.setColorData(dct88Array, 'dct');

    logger.info('-------- End running dct88 --------', '');

    return dct88Array;
  },

  idct({ data, width, height }) {
    logger.info('', '------- Start running idct88 -------');

    const idct88Array = dct88s.idct88(data, width, height);

    logger.info('calculate idct88 [√]');

    GlobalExp1.setColorData(idct88Array, 'idct');

    logger.info('-------- End running idct88 --------', '');

    return idct88Array;
  },
};

export default function discreteCosineTransform() {
  const dct = document.getElementById('dct');
  const idct = document.getElementById('idct');
  let storage = null;
  let state = FSM.none;

  const update = () => {
    state = FSM.none;
  };

  dct.addEventListener('click', () => {
    switch (state) {
    case FSM.none:
      storage = GlobalExp1.getColorData();
    case FSM.itrans: {
      const dct88Array = _.dct(storage);

      storage.data = dct88Array;
      state = FSM.trans;
    }
      break;
    case FSM.trans:
      alert('Please run idct before running dct');
      break;
    case FSM.err:
      break;
    default:
    }
  });

  idct.addEventListener('click', () => {
    switch (state) {
    case FSM.none:
    case FSM.itrans:
      alert('Please run dct before running idct');
      break;
    case FSM.trans: {
      const idct88Array = _.idct(storage);

      storage.data = idct88Array;
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
