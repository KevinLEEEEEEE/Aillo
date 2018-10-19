import template from './template';
import medianDom from './domCore/medianDom';
import MedianWorker from './dataCore/median.worker';
import formatImageData from './utils';
import logger from '../../../utils/logger';

export default function medianFilter(id, parentNode) {
  const that = {};
  const { frag, medianInput } = medianDom();
  const dom = template('median', id, frag, parentNode);
  let isActive = true;
  let isChanged = false;
  const localStorage = {
    imageData: null,
    median: 1,
  };

  // --------------------------------------------------------------

  dom.toggleClickEvent = () => {
    isActive = !isActive;
  };

  medianInput.addEventListener('change', () => {
    const value = parseInt(medianInput.value, 10);

    if (value >= 1 && value % 2 === 1) {
      localStorage.median = value;

      isChanged = true;

      dom.dispatchRunEvent(); // run after the change of setting
    }
  });

  // --------------------------------------------------------------

  that.run = ({ imageData = null, changed = false } = {}) => {
    if (!(imageData.data instanceof Uint8ClampedArray)) { // imageData must come from canvas
      throw new Error('the data must be instanced from Uint8ClampedArray');
    }

    console.log(imageData);

    if (localStorage.imageData === null) { // set default data after created
      logger.info('medianFilter storage init successfully');

      localStorage.imageData = imageData;
    }

    if (!isActive) { // pass through imageData if not actived
      return Promise.resolve({ imageData, changed });
    }

    if (!(changed || isChanged)) { // transmit the former data if not changed ever
      return Promise.resolve({ imageData: localStorage.imageData, changed });
    }

    return new Promise((resolve, reject) => {
      const worker = new MedianWorker();

      worker.onmessage = (event) => {
        const formattedImageData = formatImageData(event.data);

        isChanged = false;

        localStorage.imageData = formattedImageData;

        resolve({ imageData: formattedImageData, changed: true });
      };

      worker.onerror = (event) => {
        reject(event);
      };

      worker.postMessage({ imageData, median: localStorage.median });
    });
  };

  // --------------------------------------------------------------

  return that;
}
