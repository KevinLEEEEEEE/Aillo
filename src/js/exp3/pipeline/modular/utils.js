const formatImageData = ({ data, width, height }) => {
  if (typeof window === 'object') {
    return new window.ImageData(data, width, height);
  }
  return { data, width, height };
};

export default formatImageData;
