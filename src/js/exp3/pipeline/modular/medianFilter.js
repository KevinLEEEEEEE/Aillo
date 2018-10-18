import template from './template';
import medianDom from './domCore/medianDom';
import medianData from './dataCore/medianData';
import logger from '../../../utils/logger';

export default function medianFilter(id, parentNode, superior) {
  const that = {};
  const { frag, medianInput } = medianDom();
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

  medianInput.addEventListener('change', () => {
    const value = parseInt(medianInput.value, 10);

    if (value >= 1 && value % 2 === 1) {
      localStorage.average = value;

      isChanged = true;

      superior.run(); // run after the change of setting
    }
  });

  logger.info('init medianFilter successfully');

  that.run = ({ imageData, changed }) => {
    if (!(imageData.data instanceof Uint8ClampedArray)) { // imageData must come from canvas
      throw new Error('the data must be instanced from Uint8ClampedArray');
    }

    if (typeof changed !== 'boolean') {
      throw new Error('the isChanged state must be a boolean');
    }

    if (localStorage.imageData === null) { // set default data after created
      logger.info('medianFilter storage init successfully');

      localStorage.imageData = imageData;
    }

    if (!isActive) { // pass through imageData if not actived
      return { imageData, changed };
    }

    if (!(changed || isChanged)) { // transmit the former data if not changed ever
      return { imageData: localStorage.imageData, changed };
    }

    const outputData = medianData(imageData, localStorage.average); // changed, then recalculate

    // do sth, remember not to change the original data

    isChanged = false;

    localStorage.imageData = outputData;

    return { imageData: outputData, changed: true }; // update the 'changed' state
  };

  that.remove = () => {
    if (superior.remove(id)) { // if successfully removed from pipe, then remove node
      dom.removeFromParent();

      logger.info('remove medianFilter successfully');

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
