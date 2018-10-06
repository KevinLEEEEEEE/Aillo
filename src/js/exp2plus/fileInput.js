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
  const inputBox = document.getElementById(`inputBox${index}`);
  const exp = document.getElementById(`exp${index}`);
  const imgInput = exp.getElementsByTagName('input')[0];
  const inputHelper = document.getElementById(`inputHelper${index}`);
  const restoreBtn = document.getElementById(`restore${index}`);
  const storage = {
    file: null,
  };

  const update = () => {
  };

  imgInput.addEventListener('change', (e) => {
    const { files } = e.target;

    logger.info('file changed by selecting.');

    _.display(files[0]).hideHelper(inputHelper);

    [storage.file] = files;
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

    _.display(file).hideHelper(inputHelper);

    storage.file = file;
  });

  restoreBtn.addEventListener('click', () => {
    if (storage !== null) {
      _.display(storage.file);
    }
  });

  return update;
}
