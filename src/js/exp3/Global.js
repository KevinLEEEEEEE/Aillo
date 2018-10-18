import fileInput from './fileInput';

import canvasManager from './api/canvasManager';
import imageManager from './api/imageManager';
import domManager from './api/domManager';
import pipeline from './pipeline/pipeline';
import logger from '../utils/logger';

const _ = {
  setNewImage(base64) {
    this.imageManager.convertBase64ToImage(base64)
      .then((image) => {
        const imageData = this.imgBox.drawImage(image)
          .adjustToParent()
          .getImageData();

        this.localStorage.inputData = imageData;
      });
  },

  // --------------------------------------------------------------

  updateDisplay(imageData) {
    this.imgBox.setImageData(imageData)
      .adjustToParent();
  },

  updateNewImage(base64) {
    this.imgBox.setBase64(base64)
      .then(() => {
        this.storage.inputData = this.imgBox.adjustToParent()
          .getImageData();
      });
  },
};

export default function Global() {
  const { imgBox4: imgBox } = domManager.getById('imgBox4');
  const { pipeScrollArea } = domManager.getById('pipeScrollArea');
  let myPipeline = null;

  _.imgBox = canvasManager(imgBox);

  _.imageManager = imageManager();

  const localStorage = {
    set inputData(inputData) {
      myPipeline.run(inputData);
    },

    set outputData(outputData) {
      const { imageData, changed } = outputData;

      if (changed !== false) {
        _.updateDisplay(imageData);
      }
    },
  };

  const pipelineCallback = (outputData) => {
    localStorage.outputData = outputData;
  };

  myPipeline = pipeline(pipeScrollArea, pipelineCallback);

  fileInput();

  document.getElementById('addComponent').addEventListener('click', () => {
    myPipeline.add('averageFilter');
  });
}
