import imageManager from './api/imageManager';
import GlobalExp2 from './Global_exp2';
import logger from '../utils/logger';

const _ = {

};

export default function manipulation() {
  const addInput = document.getElementById('addImage');
  const subInput = document.getElementById('subImage');
  const addBtn = document.getElementById('add');
  const subBtn = document.getElementById('sub');

  const storage = {

  };

  addInput.addEventListener('change', (e) => {
    e.stopPropagation();

    const { target } = e;
    const { files } = target;

    logger.info('add image setected');

    // imageDAC.display(files[0]);
  });

  subInput.addEventListener('change', (e) => {
    e.stopPropagation();

    const { target } = e;
    const { files } = target;

    logger.info('add image setected');

    // imageDAC.display(files[0]);
  });

  addBtn.addEventListener('click', () => {

  });

  subBtn.addEventListener('click', () => {

  });
}
