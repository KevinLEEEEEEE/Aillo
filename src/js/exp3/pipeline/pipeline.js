import averageFilter from './modular/averageFilter';
import medianFilter from './modular/medianFilter';
import logger from '../../utils/logger';

const pipelineProp = {
  /**
   * @param {string} type
   * @returns {symbol}
   */
  getID(type) {
    return Symbol(type);
  },

  /**
   * @param {string} type
   * @param {symbol} id
   * @param {Node} parentNode
   * @returns {object}
   */
  getComponent(type, id, parentNode) {
    let component = null;

    switch (type) {
    case 'averageFilter':
      component = averageFilter(id, parentNode);
      break;

    case 'medianFilter':
      component = medianFilter(id, parentNode);
      break;

    default:
      throw new Error(`unknown module: ${type}`);
    }

    return component;
  },

  /**
   * @param {string} type
   * @param {symbol} id
   * @param {Node} parentNode
   */
  addToPipe(type, id, component) {
    this.pipelineFlow.push(id);

    this.pipelineLut[id] = {
      component, type, isActive: true, isChanged: false,
    };

    return this;
  },

  /**
   * @param {symbol} id
   * @returns {number}
   */
  removeFromPipe(id) {
    const index = this.pipelineFlow.indexOf(id);

    if (index !== -1 && Reflect.has(this.pipelineLut, id)) {
      this.pipelineFlow.splice(index, 1);

      Reflect.deleteProperty(this.pipelineLut, id);

      if (index > 0) {
        const targetID = this.pipelineFlow[index - 1]; // change the state of previous component

        this.pipelineLut[targetID].isChanged = true;
      }

      logger.info('remove component from pipeline');
    }

    return index;
  },

  /**
   * 运行整个管道
   * @param {ImageData} imageData
   * @returns {ImageData}
   */
  run(imageData) {
    logger.info('pipeline start running');

    if (this.pipelineFlow.length === 0) {
      return { imageData, changed: true };
    }

    const outputData = this.pipelineFlow.reduce((prev, current) => {
      const {
        component, type, isActive, isChanged, // type is for combination
      } = this.pipelineLut[current];

      if (isActive === false) {
        return prev;
      }

      prev.changed = prev.changed || isChanged;

      return component.run(prev);
    }, { imageData, changed: false });

    return outputData;
  },
};

/**
 * @param {Node} parentNode
 * @param {function} callback
 * @returns {object}
 */
export default function pipeline(parentNode, callback) {
  const pipe = Object.create(pipelineProp);
  const that = {};
  const localStorage = {
    imageData: null,
  };

  pipe.pipelineFlow = [];
  pipe.pipelineLut = {};

  // --------------------------------------------------------------

  parentNode.addEventListener('delete', (e) => {
    logger.info('receive delete request from children');

    e.stopPropagation();

    pipe.removeFromPipe(e.detail.id);

    if (localStorage.imageData !== null) {
      const outputData = pipe.run(localStorage.imageData);

      callback(outputData);
    }
  });

  parentNode.addEventListener('run', (e) => {
    logger.info('receive run request from children');

    e.stopPropagation();

    if (localStorage.imageData !== null) {
      const outputData = pipe.run(localStorage.imageData);

      callback(outputData);
    }
  });

  // --------------------------------------------------------------

  /**
   * @param {*} imageData
   */
  that.run = (imageData = null) => {
    if (imageData === null) {
      throw new Error('please run the pipeline with calid input');
    }

    if (!(imageData.data instanceof Uint8ClampedArray)) { // imageData must come from canvas
      throw new Error('the input data must be an Uint8ClampedArray');
    }

    localStorage.imageData = imageData;

    const outputData = pipe.run(imageData);

    callback(outputData);
  };

  /**
   * @param {string} type
   */
  that.add = (type) => {
    if (type === null) {
      throw new Error('please create a compone t with a valid type');
    }

    if (typeof type !== 'string') {
      throw new Error('the type must be a string');
    }

    const id = pipe.getID(type);
    const component = pipe.getComponent(type, id, parentNode);

    pipe.addToPipe(type, id, component);

    if (localStorage.imageData !== null) { // run the precess only when the image exist
      pipe.run(localStorage.imageData);
    }
  };

  // --------------------------------------------------------------

  return that;
}
