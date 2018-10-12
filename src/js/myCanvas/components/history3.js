
export default function history(maxStep = 0) {
  const that = {};
  const historyArray = [];
  let currentPos = -1;
  let undoPos = -1 - maxStep;
  let redoPos = -1;

  that.redo = () => {
    if (!that.canRedo()) {
      if (currentPos === redoPos) {
        throw new Error('please undo something before redo');
      }
      throw new Error('cannot redo');
    }

    currentPos += 1;

    return historyArray[currentPos % maxStep];
  };

  that.undo = () => {
    if (!that.canUndo()) {
      if (currentPos === -1) {
        throw new Error('please do something before undo');
      } else if (currentPos === 0) {
        throw new Error('no step to undo anymore');
      }
      throw new Error('cannot undo');
    }

    currentPos -= 1;

    return historyArray[currentPos % maxStep];
  };

  that.do = (imageData) => {
    currentPos += 1;
    undoPos += 1;
    redoPos = currentPos;

    historyArray[currentPos % maxStep] = imageData;

    return that;
  };

  that.canRedo = () => redoPos > currentPos;

  that.canUndo = () => undoPos < currentPos && currentPos > 0;

  that.getHistoryArray = () => [...historyArray];

  return that;
}
