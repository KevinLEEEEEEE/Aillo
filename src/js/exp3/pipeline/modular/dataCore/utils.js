const blankImageData = (() => {
  const cvs = document.createElement('canvas');
  const ctx = cvs.getContext('2d');

  return (width = 0, height = 0) => ctx.createImageData(width, height);
})();

const pos = (index, w) => {
  const x = index % w;
  const y = Math.floor(index / w);

  return { x, y };
};

export {
  blankImageData,
  pos,
};
