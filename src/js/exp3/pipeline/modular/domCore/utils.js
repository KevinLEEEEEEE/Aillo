const createCustomEvent = (name, detail, bubbles = true, cancelable = false, composed = false) => {
  if (typeof name !== 'string') {
    throw new Error('please use a string as the name of event');
  }

  if (typeof detail !== 'object') {
    throw new Error('detail must be an object');
  }

  return new CustomEvent(name, {
    detail,
    bubbles,
    cancelable,
    composed,
  });
};

const others = () => {};

export {
  createCustomEvent,
  others,
};
