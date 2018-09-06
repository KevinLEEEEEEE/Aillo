import logger from '../../utils/logger';

const _bitMapManager = {
  convertCanvasToImageData(canvas) {
    const w = canvas.width;
    const h = canvas.height;

    return canvas.getContext('2d').getImageData(0, 0, w, h);
  },

  convertCanvasToBitMap(oData) {
    const biWidth = oData.width;
    const biHeight = oData.height;
    const biSizeImage = biWidth * biHeight * 3;
    const bfSize = biSizeImage + 54;

    const BITMAPFILEHEADER = [
      0x42, 0x4D,
      bfSize & 0xff, (bfSize >> 8) & 0xff,
      (bfSize >> 16) & 0xff, (bfSize >> 24) & 0xff,
      0, 0, 0, 0,
      54, 0, 0, 0,
    ];

    const BITMAPINFOHEADER = [
      40, 0, 0, 0,
      biWidth & 0xff, (biWidth >> 8) & 0xff,
      (biWidth >> 16) & 0xff, (biWidth >> 24) & 0xff,
      biHeight & 0xff, (biHeight >> 8) & 0xff,
      (biHeight >> 16) & 0xff, (biHeight >> 24) & 0xff,
      1, 0, 24, 0,
      0, 0, 0, 0,
      biSizeImage & 0xff, (biSizeImage >> 8) & 0xff,
      (biSizeImage >> 16) & 0xff, (biSizeImage >> 24) & 0xff,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ];

    const iPadding = (4 - ((biWidth * 3) % 4)) % 4;

    const aImgData = oData.data;

    let strPixelData = '';
    const biWidth4 = biWidth << 2;
    let y = biHeight;
    const { fromCharCode } = String;

    do {
      const iOffsetY = biWidth4 * (y - 1);
      let strPixelRow = '';
      for (let x = 0; x < biWidth; x += 1) {
        const iOffsetX = x << 2;
        strPixelRow += fromCharCode(aImgData[iOffsetY + iOffsetX + 2])
          + fromCharCode(aImgData[iOffsetY + iOffsetX + 1])
          + fromCharCode(aImgData[iOffsetY + iOffsetX]);
      }

      for (let c = 0; c < iPadding; c += 1) {
        strPixelRow += String.fromCharCode(0);
      }

      strPixelData += strPixelRow;

      y -= 1;
    } while (y);

    const header = BITMAPFILEHEADER.concat(BITMAPINFOHEADER);
    const strEncoded = this.encodeData(header) + this.encodeData(strPixelData);

    return strEncoded;
  },

  encodeData(data) {
    if (!window.btoa) {
      logger.error('btoa not defined');
    }

    let str = '';
    if (typeof data === 'string') {
      str = data;
    } else {
      for (let i = 0; i < data.length; i += 1) {
        str += String.fromCharCode(data[i]);
      }
    }

    return window.btoa(str);
  },

  makeURI(strData, type) {
    return `data:${type};base64,${strData}`;
  },
};

const bitMapManager = {
  convertCanvasToBase64(canvas) {
    const imageData = _bitMapManager.convertCanvasToImageData(canvas);
    const bitMapData = _bitMapManager.convertCanvasToBitMap(imageData);
    const URI = _bitMapManager.makeURI(bitMapData, 'image/bmp');

    return URI;
  },
};

export default bitMapManager;
