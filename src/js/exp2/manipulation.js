import imageManager from './api/imageManager';
import GlobalExp2 from './Global_exp2';
import logger from '../utils/logger';

const _ = {
  isFit(target, data) {

  },

  resize() {

  },

  add(target, data) {

  },

  sub(target, data) {

  },
};

export default function manipulation() {
  const addInput = document.getElementById('addImage');
  const subInput = document.getElementById('subImage');
  const addBtn = document.getElementById('add');
  const subBtn = document.getElementById('sub');

  const localStorage = {
    addImage: null,
    subImage: null,
  };

  let storage = null;

  const update = () => {
    storage = GlobalExp2.getColorData();
  };

  addInput.addEventListener('change', (e) => {
    e.stopPropagation();

    const { target } = e;
    const { files } = target;

    logger.info('add image setected');

    imageManager.convertFileToCanvas(files[0])
      .then((canvas) => {
        console.log(canvas);
      });

    // [localStorage.addImage] = files;
  });

  subInput.addEventListener('change', (e) => {
    e.stopPropagation();

    const { target } = e;
    const { files } = target;

    logger.info('add image setected');

    // imageDAC.display(files[0]);
  });

  addBtn.addEventListener('click', () => {
    if (localStorage.addImage === null || storage === null) {
      return;
    }

    _.add(storage, localStorage.addImage);
  });

  subBtn.addEventListener('click', () => {
    if (localStorage.subImage === null || storage === null) {
      return;
    }

    _.sub(storage, localStorage.subImage);
  });

  return update;
}
