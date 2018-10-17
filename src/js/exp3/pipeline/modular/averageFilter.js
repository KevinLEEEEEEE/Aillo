import template from '../template';
import averageDom from './domCore/averageDom';
import averageData from './dataCore/averageData';
import logger from '../../../utils/logger';

export default function averageFilter(id, parentNode, superior) {
  const that = {};
  const { frag, averageInput } = averageDom();
  const dom = template('average', frag);
  let isActive = true;
  let isChanged = false;
  const localStorage = {
    imageData: null,
    average: 1,
  };

  dom.appendToParent(parentNode);

  dom.toggleBtn.addEventListener('click', () => {
    isActive = !isActive;

    superior.run(); // run after state change
  });

  dom.deleteBtn.addEventListener('click', () => {
    that.remove();
  });

  averageInput.addEventListener('change', () => {
    const value = parseInt(averageInput.value, 10);

    if (value >= 1 && value % 2 === 1) {
      localStorage.average = value;

      isChanged = true;

      superior.run(); // run after the change of setting
    } else {
      averageInput.value = 'x > 1 && x is odd';
    }
  });

  logger.info('init averageFilter successfully');

  that.run = ({ imageData, changed }) => {
    if (!(imageData.data instanceof Uint8ClampedArray)) { // imageData must come from canvas
      throw new Error('the data must be instanced from Uint8ClampedArray');
    }

    if (typeof changed !== 'boolean') {
      throw new Error('the isChanged state must be a boolean');
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

  that.remove = () => {
    if (superior.remove(id) === true) { // if successfully removed from pipe, then remove node
      dom.removeFromParent();

      logger.info('remove averageFilter successfully');

      superior.run();
    } else {
      throw new Error('unable to remove component from pipeline');
    }
  };

  that.forceChange = () => {
    isChanged = true;
  };

  return that;
}
