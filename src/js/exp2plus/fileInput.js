import logger from '../utils/logger';
import GlobalExp2plus from './Global_exp2plus';

const _ = {
  display(file) {
    const objectURL = window.URL.createObjectURL(file);

    GlobalExp2plus.setBase64(objectURL);

    return this;
  },

  hideHelper(inputHelper) {
    inputHelper.classList.add('hide');

    return this;
  },
};

export default function fileInput(index) {
  const doc = document;
  const inputBox = doc.getElementById(`inputBox${index}`);
  const exp = doc.getElementById(`exp${index}`);
  const imgInput = exp.getElementsByTagName('input')[0];
  const inputHelper = doc.getElementById(`inputHelper${index}`);
  const restoreBtn = doc.getElementById(`restore${index}`);
  const storage = {
    file: null,
  };

  const update = () => {
  };

  imgInput.addEventListener('change', (e) => {
    const { files } = e.target;

    logger.info('file changed by selecting.');

    [storage.file] = files;

    _.display(files[0]);

    if (storage.file === null) _.hideHelper(inputHelper);
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

    storage.file = file;

    _.display(file);

    if (storage.file === null) _.hideHelper(inputHelper);
  });

  restoreBtn.addEventListener('click', () => {
    if (storage !== null) {
      _.display(storage.file);
    }
  });

  return update;
}
