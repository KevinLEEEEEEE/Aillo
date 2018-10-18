import fileInput from './fileInput';

import canvasManager from './api/canvasManager';
import imageManager from './api/imageManager';
import domManager from './api/domManager';
import pipeline from './pipeline/pipeline';
import logger from '../utils/logger';

const GlobalExp3 = {
  init() {
    const { imgBox4: imgBox } = domManager.getById('imgBox4');
    const { pipeScrollArea: componentArea } = domManager.getById('pipeScrollArea');

    this.imgBox = canvasManager(imgBox);
    this.imageManager = imageManager();
    this.localStorage = {
      set inputData(inputData) {
        GlobalExp3.pipeline.run(inputData);
      },

      set outputData(outputData) {
        const { imageData, changed } = outputData;

        if (changed !== false) {
          GlobalExp3.updateDisplay(imageData);
        }
      },
    };

    const pipelineCallback = (outputData) => {
      this.localStorage.outputData = outputData;
    };

    this.pipeline = pipeline(componentArea, pipelineCallback);

    fileInput();

    document.getElementById('addComponent').addEventListener('click', () => {
      this.pipeline.add('averageFilter');
      // this.pipeline.add('medianFilter');
    });

    return this;
  },

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

export default GlobalExp3;
