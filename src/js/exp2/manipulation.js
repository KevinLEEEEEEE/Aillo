import imageManager from './api/imageManager';
import GlobalExp2 from './Global_exp2';
import logger from '../utils/logger';

const _ = {
  resize(target, input) {
    const { width: targetWidth, height: targetHeight } = target;
    const { width, height } = input;
    const targetRatio = targetWidth / targetHeight;
    const ratio = width / height;
    let sx = 0;
    let sy = 0;
    let swidth = 0;
    let sheight = 0;

    if (targetRatio > ratio) {
      const r = targetWidth / width;

      swidth = width;
      sheight = targetHeight / r;
      sx = 0;
      sy = (height - sheight) / 2;
    } else {
      const r = targetHeight / height;

      swidth = targetWidth / r;
      sheight = height;
      sx = (width - swidth) / 2;
      sy = 0;
    }

    return {
      sx, sy, swidth, sheight,
    };
  },

  cut(target, input, {
    sx, sy, swidth, sheight,
  }) {
    const { width: targetWidth, height: targetHeight } = target;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.drawImage(input, sx, sy, swidth, sheight, 0, 0, targetWidth, targetHeight);

    return ctx.getImageData(0, 0, targetWidth, targetHeight);
  },

  add(target, input) {
    const resizedInput = this.resize(target, input);
    const cutImageData = this.cut(target, input, resizedInput);
    const decolorized = imageManager.decolorization(cutImageData);
    const compressed = imageManager.compressImageData(decolorized);

    return target.data.map((value, index) => value / 2 + compressed[index] / 2);
  },

  sub(target, input) {
    const resizedInput = this.resize(target, input);
    const cutImageData = this.cut(target, input, resizedInput);
    const decolorized = imageManager.decolorization(cutImageData);
    const compressed = imageManager.compressImageData(decolorized);

    return target.data.map((value, index) => value * 2 - compressed[index]);
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

    imageManager.convertFileToBase64(files[0])
      .then(base64 => imageManager.convertBase64ToImage(base64))
      .then((image) => {
        localStorage.addImage = image;

        logger.info('add image ready');
      });
  });

  subInput.addEventListener('change', (e) => {
    e.stopPropagation();

    const { target } = e;
    const { files } = target;

    imageManager.convertFileToBase64(files[0])
      .then(base64 => imageManager.convertBase64ToImage(base64))
      .then((image) => {
        localStorage.subImage = image;

        logger.info('sub image ready');
      });
  });

  addBtn.addEventListener('click', () => {
    if (localStorage.addImage === null || storage === null) {
      return;
    }

    const added = _.add(storage, localStorage.addImage);

    GlobalExp2.setColorData(added);

    // GlobalExp2.update();

    localStorage.addImage = null;
  });

  subBtn.addEventListener('click', () => {
    if (localStorage.subImage === null || storage === null) {
      return;
    }

    const subed = _.sub(storage, localStorage.subImage);

    GlobalExp2.setColorData(subed);

    // GlobalExp2.update();

    localStorage.subImage = null;
  });

  return update;
}
