import logger from '../utils/logger';
import domManager from './api/domManager';
import global from './Global_exp3';

const _ = {
  getBase64(file) {
    return window.URL.createObjectURL(file);
  },

  hide(inputHelper) {
    inputHelper.classList.add('hide');
  },
};

export default function fileInput() {
  const {
    inputBox4: inputBox, imgInput4: imgInput, helper4: helper, restore4: restore,
  } = domManager.getById('inputBox4', 'imgInput4', 'helper4', 'restore4');
  const storage = {
    file: null,
  };

  const update = (file) => {
    if (file === null) {
      return;
    }

    if (storage.file === null) {
      _.hide(helper);
    }

    storage.file = file;

    const base64 = _.getBase64(file);

    global.setNewImage(base64);
  };

  imgInput.addEventListener('change', (e) => {
    const { files } = e.target;

    logger.info('file changed by selecting.');

    update(files[0]);
  });

  inputBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  inputBox.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];

    logger.info('file changed by dragging.');

    update(file);
  });

  restore.addEventListener('click', () => {
    update(storage.file);
  });
}
