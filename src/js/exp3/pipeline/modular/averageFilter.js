import template from './template';
import averageDom from './domCore/averageDom';
import AverageWorker from './dataCore/average.worker';
import formatImageData from './utils';
import logger from '../../../utils/logger';

export default function averageFilter(id, parentNode) {
  const that = {};
  const { frag, averageInput } = averageDom();
  const dom = template('average', id, frag, parentNode);
  let isActive = true;
  let isChanged = false;
  const localStorage = {
    imageData: null,
    average: 0,
  };

  // --------------------------------------------------------------

  dom.toggleClickEvent = () => {
    isActive = !isActive;
  };

  averageInput.addEventListener('change', () => {
    const value = parseInt(averageInput.value, 10);

    if (isActive === true && value >= 1 && value % 2 === 1) {
      localStorage.average = value;

      isChanged = true;

      dom.dispatchRunEvent(); // run after the change of setting
    }
  });

  // --------------------------------------------------------------

  /**
   * @returns {Promise} - the params of previous component
   */
  that.getParamsPackage = () => ({
    average: localStorage.average,
  });

  that.getStates = () => ({
    isActive,
    isChanged,
  });

  /**
   * @param {ImageData} imageData
   * @param {Boolean} changed
   * @param {Object} paramsPackage
   * @returns {Promise}
   */
  that.run = ({ imageData = null, changed = false, paramsPackage = null }) => {
    if (!(imageData.data instanceof Uint8ClampedArray)) { // imageData must come from canvas
      throw new Error('the data must be instanced from Uint8ClampedArray');
    }

    logger.info('average filter component start running');

    if (localStorage.imageData === null) { // set default data after created
      logger.info('init storage after the creation of the component');

      localStorage.imageData = imageData;
    }

    if (!isActive) { // pass through imageData if not actived
      logger.info('disabled component, skip the process');

      return Promise.resolve({ imageData, changed });
    }

    if (!(changed || isChanged)) { // transmit the former data if not changed ever
      logger.info('no change yet, skip the process');

      return Promise.resolve({ imageData: localStorage.imageData, changed });
    }

    if (isChanged === true) {
      logger.info(`component changed, average: ${localStorage.average}`);
    } else {
      logger.info('no change in this component, but previous component has changed');
    }

    return new Promise((resolve, reject) => {
      const worker = new AverageWorker();

      worker.onmessage = (event) => {
        const formattedImageData = formatImageData(event.data);

        isChanged = false;

        localStorage.imageData = formattedImageData;

        logger.info('average filter web worker finished, update local imageData storage');

        resolve({ imageData: formattedImageData, changed: true });
      };

      worker.onerror = (event) => {
        logger.error('average filter web worker error');

        reject(event);
      };

      let { average } = localStorage; // need to be improved

      if (paramsPackage !== null) {
        average += paramsPackage.average;

        average = average % 2 === 1 ? average : average + 1;
      }

      logger.info(`run with params - average: ${average}`);

      worker.postMessage({ imageData, average });
    });
  };

  // --------------------------------------------------------------

  return that;
}
