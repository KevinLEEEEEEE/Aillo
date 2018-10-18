import { createCustomEvent } from './domCore/utils';
import logger from '../../../utils/logger';

const nodePool = {
  pool: [],

  doc: document,

  createAndAppend(parent = null, nodeType = 'div', ...klass) {
    const node = this.doc.createElement(nodeType);

    if (klass !== []) {
      node.classList.add(klass);
    }

    if (parent !== null) {
      parent.appendChild(node);
    }

    return node;
  },

  generator() {
    const pipeComponent = this.createAndAppend(null, 'div', 'pipeComponent');

    const pipeHeader = this.createAndAppend(pipeComponent, 'div', 'pipeHeader');
    const pipeContent = this.createAndAppend(pipeComponent, 'div', 'pipeContent');
    const pipeFooter = this.createAndAppend(pipeComponent, 'div', 'pipeFooter');

    const componentType = this.createAndAppend(pipeHeader, 'span', 'componentType');
    const toggleBtn = this.createAndAppend(pipeFooter, 'button', 'pipeBtn');
    const deleteBtn = this.createAndAppend(pipeFooter, 'button', 'pipeBtn');

    toggleBtn.innerHTML = 'toggle';
    deleteBtn.innerHTML = 'delete';

    return {
      pipeComponent, pipeContent, componentType, toggleBtn, deleteBtn,
    };
  },

  getNode() {
    if (this.pool.length === 0) {
      return this.generator();
    }

    return this.pool.pop();
  },

  returnNode(node) {
    if (this.pool.length < 10) {
      this.pool.push(node);
    }
  },
};

export default function template(typeName = 'none', id, content = null, parentNode) {
  const that = {};
  const templateNode = nodePool.getNode();
  const {
    pipeComponent, pipeContent, componentType, toggleBtn, deleteBtn,
  } = templateNode;
  const localStorage = {
    deleteEvent: createCustomEvent('delete', { id }),
    runEvent: createCustomEvent('run', { id }),
  };

  // --------------------------------------------------------------

  const toggleBtnHandle = (e) => {
    pipeComponent.dispatchEvent(localStorage.runEvent);

    try {
      that.toggleClickEvent(e);
    } catch (error) {
      logger.error('error with toggle click event');
    }
  };

  const deleteBtnHandle = (e) => {
    pipeComponent.dispatchEvent(localStorage.deleteEvent);

    toggleBtn.removeEventListener('click', toggleBtnHandle, false); // remove events

    deleteBtn.removeEventListener('click', deleteBtnHandle, false);

    componentType.innerHTML = ''; // clean content

    pipeContent.innerHTML = '';

    parentNode.removeChild(pipeComponent); // remove node from document

    nodePool.returnNode(templateNode);

    try {
      that.deleteClickEvent(e); // run custon events
    } catch (error) {
      logger.error('error with delete click event');
    }
  };

  // --------------------------------------------------------------

  if (typeof typeName !== 'string') {
    throw new Error('plesae set type with a string');
  }

  componentType.innerHTML = typeName;

  if (content === null) {
    throw new Error('plesae set content with a valid node');
  }

  pipeContent.appendChild(content);

  if (parentNode === null) {
    throw new Error('plesae set parent with a valid node');
  }

  parentNode.appendChild(pipeComponent);

  // --------------------------------------------------------------

  toggleBtn.addEventListener('click', toggleBtnHandle, false);

  deleteBtn.addEventListener('click', deleteBtnHandle, false);

  // --------------------------------------------------------------

  that.toggleClickEvent = () => {};

  that.deleteClickEvent = () => {};

  that.dispatchRunEvent = () => {
    pipeComponent.dispatchEvent(localStorage.runEvent);
  };

  // --------------------------------------------------------------

  return that;
}
