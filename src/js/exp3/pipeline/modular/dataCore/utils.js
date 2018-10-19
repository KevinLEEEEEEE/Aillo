
/**
 * @param {number} index
 * @param {number} w
 * @returns {object}
 */
const pos = (index, w) => {
  const x = index % w;
  const y = Math.floor(index / w);

  return { x, y };
};

/**
 * get an ImageData like object
 * @param {number} width
 * @param {number} height
 * @returns {object}
 */
const getImageData = (width, height) => ({
  data: new Uint8ClampedArray(width * height * 4),
  width,
  height,
});

export {
  getImageData,
  pos,
};
