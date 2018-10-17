import averageFilter from './modular/averageFilter';
import medianFilter from './modular/medianFilter';
import logger from '../../utils/logger';

const pipelineProp = {
  getID(type) {
    return Symbol(type);
  },

  getComponent(type, id, parentNode, superior) {
    let component = null;

    switch (type) {
    case 'averageFilter':
      component = averageFilter(id, parentNode, superior);
      break;
    case 'medianFilter':
      component = medianFilter(id, parentNode, superior);
      break;
    default:
    }

    return component;
  },

  addToPipe(id, component) {
    this.pipelineFlow.push(id);

    this.pipelineLut[id] = component;

    return this;
  },

  removeFromPipe(id) {
    const index = this.pipelineFlow.indexOf(id);

    if (index !== -1 && Reflect.has(this.pipelineLut, id)) {
      this.pipelineFlow.splice(index, 1);

      Reflect.deleteProperty(this.pipelineLut, id);

      const nextID = this.pipelineFlow[index];
      const nextComponent = this.pipelineLut[nextID];

      nextComponent.forceChange(); // force the component to recalculate after delete

      logger.info('remove component from pipeline');

      return true;
    }

    return false;
  },

  run(imageData) {
    logger.info('pipeline start running');

    if (this.pipelineFlow.length === 0) {
      return { imageData, changed: true };
    }

    const outputData = this.pipelineFlow.reduce((prev, current) => {
      const component = this.pipelineLut[current];

      return component.run(prev);
    }, { imageData, changed: false });

    return outputData;
  },
};

export default function pipeline(parentNode, deliveryPort) {
  const pipe = Object.create(pipelineProp);
  const that = {};
  const localStorage = {
    imageData: null,
  };
  const superior = {
    remove(id) {
      return pipe.removeFromPipe(id);
    },

    run() {
      if (localStorage.imageData !== null) {
        deliveryPort.outputData = pipe.run(localStorage.imageData);
      }
    },
  };

  pipe.pipelineFlow = [];
  pipe.pipelineLut = {};

  // --------------------------------------------------------------

  that.run = (imageData = null) => {
    if (imageData === null) {
      throw new Error('please run the pipeline with calid input');
    }

    if (!(imageData.data instanceof Uint8ClampedArray)) { // imageData must come from canvas
      throw new Error('the input data must be an Uint8ClampedArray');
    }

    localStorage.imageData = imageData;

    deliveryPort.outputData = pipe.run(imageData);
  };

  that.add = (type) => {
    if (type === null) {
      throw new Error('please create a compone t with a valid type');
    }

    if (typeof type !== 'string') {
      throw new Error('the type must be a string');
    }

    const id = pipe.getID(type);
    const component = pipe.getComponent(type, id, parentNode, superior);

    pipe.addToPipe(id, component);

    if (localStorage.imageData !== null) { // run the precess only when the image exist
      pipe.run(localStorage.imageData);
    }
  };

  // --------------------------------------------------------------

  return that;
}
