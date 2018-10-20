import averageFilter from './modular/averageFilter';
import medianFilter from './modular/medianFilter';
import logger from '../../utils/logger';

const COMBINELIST = ['averageFilter'];

const pipelineProp = {
  /**
   * @param {String} type
   * @returns {Symbol}
   */
  getID(type) {
    return Symbol(type);
  },

  /**
   * @param {String} type
   * @param {Symbol} id
   * @param {Node} parentNode
   * @returns {Object}
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
   * @param {String} type
   * @param {Symbol} id
   * @param {Node} parentNode
   */
  addToPipe(type, id, component) {
    this.pipelineFlow.push(id);

    this.pipelineLut[id] = {
      component, type, isActive: true, isChanged: false,
    };

    logger.info(`[P] add component ${type} to pipeline [√]`);

    return this;
  },

  /**
   * @param {Symbol} id
   * @returns {Number}
   */
  removeFromPipe(id) {
    const index = this.pipelineFlow.indexOf(id);

    if (index !== -1 && Reflect.has(this.pipelineLut, id)) {
      this.pipelineFlow.splice(index, 1);

      Reflect.deleteProperty(this.pipelineLut, id);

      if (index > 0) {
        const targetID = this.pipelineFlow[index - 1]; // change the state of previous component

        this.forceChange(targetID);
      } if (index === 0 && this.pipelineFlow.length > 0) {
        const targetID = this.pipelineFlow[index];

        this.forceChange(targetID);
      }

      logger.info(`[P] remove the ${index}th component from pipeline [√]`);
    }

    return index;
  },

  /**
   * @param {Symbol} id
   */
  forceChange(id) {
    if (Reflect.has(this.pipelineLut, id)) {
      this.pipelineLut[id].isChanged = true;
    }
  },

  /**
   * @param {Number} index
   * @param {String} currentType
   * @returns {Boolean}
   */
  canCombine(index, currentType) {
    if (COMBINELIST.indexOf(currentType) !== -1 && index < this.pipelineFlow.length - 1) {
      const nextID = this.pipelineFlow[index + 1];
      const nextType = this.pipelineLut[nextID].type;

      if (currentType === nextType) {
        this.forceChange(nextID);

        return true;
      }
    }

    return false;
  },

  /**
   * @param {Number} current
   * @param {Number} total
   */
  updateProgress(current, total) {
    if (current === 0) {
      this.progress.classList.remove('hide');
    }

    const progress = ((current + 1) / total) * 100;
    this.progressContent.innerHTML = `${progress.toFixed(1)}%`;

    logger.info(`[P] update progress ${progress}% [√]`);

    // if (current + 1 === total) {
    //   this.progress.classList.add('hide');
    // }
  },

  /**
   * 运行整个管道,每个component利用web worker无阻塞，同时跳过被disabled的组件
   * @param {ImageData} imageData
   * @returns {Promise}
   */
  async run(imageData) {
    logger.info('[P] pipeline start running [√]');

    const { length } = this.pipelineFlow;

    if (length === 0) {
      logger.info('[P] no component yet, skip the process [√]');

      return { imageData, changed: true };
    }

    const outputData = await this.pipelineFlow.reduce((prev, current, index) => {
      const {
        component, type, isActive, isChanged, // type is for operate combination
      } = this.pipelineLut[current];

      if (isActive === false) {
        return Promise.resolve(prev);
      }

      return prev.then((value) => {
        logger.info(`[P] running through the ${index}th component - type: ${type} [√]`);

        this.updateProgress(index, length);

        value.changed = value.changed || isChanged;
        this.pipelineLut[current].isChanged = false; // reset the state after combined

        if (this.canCombine(index, type)) {
          const paramsPackage = component.getParamsPackage();
          const states = component.getStates();

          logger.info('[P] component can be combined [√]');

          if (states.isActive === true) {
            value.paramsPackage = paramsPackage;

            value.changed = value.changed || states.isChanged;

            return Promise.resolve(value);
          }
        }

        return component.run(value);
      }, (err) => {
        logger.error(err);

        return Promise.resolve(prev);
      })
        .catch((err) => {
          logger.error(err);
        })
        .finally(() => Promise.resolve(prev));
    }, Promise.resolve({ imageData, changed: false }));

    return outputData;
  },
};

/**
 * @param {Node} parentNode
 * @param {Function} callback
 * @returns {Object}
 */
export default function pipeline(parentNode, callback) {
  const pipe = Object.create(pipelineProp);
  const that = {};
  const localStorage = {
    imageData: null,
  };

  pipe.pipelineFlow = [];
  pipe.pipelineLut = {};

  pipe.progress = document.getElementById('pipeProgress');
  pipe.progressContent = document.getElementById('pipeProgressContent');

  logger.info('[P] init pipeline [√]');

  // --------------------------------------------------------------

  parentNode.addEventListener('delete', (e) => {
    e.stopPropagation();

    logger.info('[P] receive remove event from child [√]');

    const { id } = e.detail;

    pipe.removeFromPipe(id);

    if (localStorage.imageData !== null) {
      pipe.run(localStorage.imageData).then((data) => {
        callback(data);
      });
    }
  });

  parentNode.addEventListener('run', (e) => {
    e.stopPropagation();

    logger.info('[P] receive run event from child [√]');

    if (localStorage.imageData !== null) {
      pipe.run(localStorage.imageData).then((data) => {
        callback(data);
      });
    }
  });

  // --------------------------------------------------------------

  /**
   * @param {ImageData} imageData
   */
  that.run = (imageData = null) => {
    if (imageData === null) {
      throw new Error('please run the pipeline with input');
    }

    if (!(imageData.data instanceof Uint8ClampedArray)) { // imageData must come from canvas
      throw new Error('the input data must be an ImageData');
    }

    localStorage.imageData = imageData;

    pipe.run(imageData).then((data) => {
      callback(data);
    });
  };

  /**
   * @param {String} type
   */
  that.add = (type) => {
    if (type === null) {
      throw new Error('please create a component with a valid type');
    }

    if (typeof type !== 'string') {
      throw new Error('the type must be a string');
    }

    const id = pipe.getID(type);
    const component = pipe.getComponent(type, id, parentNode);

    pipe.addToPipe(type, id, component);

    if (localStorage.imageData !== null) { // run the precess only when the image exist
      pipe.run(localStorage.imageData).then((data) => {
        callback(data);
      });
    }
  };

  // --------------------------------------------------------------

  return that;
}
