import template from './template';
import averageDom from './domCore/averageDom';
import averageData from './dataCore/averageData';
import logger from '../../../utils/logger';

export default function averageFilter(id, parentNode) {
  const that = {};
  const { frag, averageInput } = averageDom();
  const dom = template('average', id, frag, parentNode);
  let isActive = true;
  let isChanged = false;
  const localStorage = {
    imageData: null,
    average: 1,
  };

  // --------------------------------------------------------------

  dom.toggleClickEvent = () => {
    isActive = !isActive;
  };

  averageInput.addEventListener('change', () => {
    const value = parseInt(averageInput.value, 10);

    if (value >= 1 && value % 2 === 1) {
      localStorage.average = value;

      isChanged = true;

      dom.dispatchRunEvent(); // run after the change of setting
    }
  });

  // --------------------------------------------------------------

  that.run = ({ imageData = null, changed = false } = {}) => {
    if (!(imageData.data instanceof Uint8ClampedArray)) { // imageData must come from canvas
      throw new Error('the data must be instanced from Uint8ClampedArray');
    }

    if (localStorage.imageData === null) { // set default data after created
      logger.info('averageFilter storage init successfully');

      localStorage.imageData = imageData;
    }

    if (!isActive) { // pass through imageData if not actived
      return { imageData, changed };
    }

    if (!(changed || isChanged)) { // transmit the former data if not changed ever
      return { imageData: localStorage.imageData, changed };
    }

    const outputData = averageData(imageData, localStorage.average); // changed, then recalculate

    // do sth, remember not to change the original data

    isChanged = false;

    localStorage.imageData = outputData;

    return { imageData: outputData, changed: true }; // update the 'changed' state
  };

  // --------------------------------------------------------------

  return that;
}
