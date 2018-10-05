import fileInput from './fileInput';
import filter from './filter';
import noise from './noise';

import imageManager from './api/imageManager';
import canvasManager from './api/canvasManager';
import logger from '../utils/logger';

const FSM = () => {
  const states = {
    free: 0,
    busy: 1,
    error: 2,
  };
  let state = states.free;

  return {
    isFree() {
      return state === states.free;
    },

    wait() {
      if (state === states.free && state !== states.error) {
        state = states.wait;

        return this;
      }

      throw new Error('cannot change state to busy');
    },

    free() {
      if (state === states.wait && state !== states.error) {
        state = states.free;

        return this;
      }

      throw new Error('cannot change state to free');
    },

    error() {
      state = states.error;
    },
  };
};

const GlobalExp2plus = {
  init(index) {
    const imgBox = document.getElementById(`imgBox${index}`);
    const m1 = fileInput(index);
    const m2 = filter();
    const m3 = noise(index);

    this.monitorList = [m1, m2, m3];
    this.imgBox = canvasManager(imgBox);

    logger.info('[G] init all events listener [√]');

    this.fsm = FSM();
    this.storage = { imageData: null };
    this.imageManager = imageManager();

    logger.info('[G] init Global storage and stateMachine [√]');
  },

  setImageData(imageData) {
    if (!this.fsm.isFree()) {
      return;
    }

    this.fsm.wait();

    this.imgBox.setImageData(imageData).adjustToParent();
    this.update(imageData);

    this.fsm.free();
  },

  setBase64(base64) {
    if (!this.fsm.isFree()) {
      return;
    }

    this.fsm.wait();

    this.imageManager.convertBase64ToImage(base64)
      .then((image) => {
        this.imgBox.drawImage(image).adjustToParent();
        this.update();

        this.fsm.free();
      });
  },

  normalizeData(imageData) {
    return imageData === undefined ? this.imgBox.getImageData() : imageData;
  },

  notify() {
    this.monitorList.forEach((target) => {
      target(this.storage);
    });
  },

  update(imageData) {
    const data = this.normalizeData(imageData);

    this.storage.imageData = data;

    logger.info('[G] Global storage update [√]');

    this.notify();

    logger.info('[G] Global notify [√]');
  },
};

export default GlobalExp2plus;
