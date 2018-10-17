const DOC = document;

const createAndAppend = (parent = null, nodeType = 'div', ...klass) => {
  const node = DOC.createElement(nodeType);

  if (klass !== []) {
    node.classList.add(klass);
  }

  if (parent !== null) {
    parent.appendChild(node);
  }

  return node;
};

const createTextNodeAndAppend = (parent = null, content) => {
  const textNode = DOC.createTextNode(content);

  if (parent !== null) {
    parent.appendChild(textNode);
  }

  return textNode;
};

const emptyNode = (node) => {
  while (node.firstChild !== null) {
    node.removeChild(node.firstChild);
  }
};

const nodePool = {
  pool: [],

  generater() {
    const pipeComponent = createAndAppend(null, 'div', 'pipeComponent');

    const pipeHeader = createAndAppend(pipeComponent, 'div', 'pipeHeader');
    const pipeContent = createAndAppend(pipeComponent, 'div', 'pipeContent');
    const pipeFooter = createAndAppend(pipeComponent, 'div', 'pipeFooter');

    const componentType = createAndAppend(pipeHeader, 'span', 'componentType');

    createTextNodeAndAppend(componentType, 'none');

    const toggleBtn = createAndAppend(pipeFooter, 'button', 'pipeBtn');
    const deleteBtn = createAndAppend(pipeFooter, 'button', 'pipeBtn');

    createTextNodeAndAppend(toggleBtn, 'toggle');
    createTextNodeAndAppend(deleteBtn, 'delete');

    return {
      pipeComponent, pipeHeader, pipeContent, pipeFooter, componentType, toggleBtn, deleteBtn,
    };
  },

  format(node) {
    const {
      pipeContent, componentType,
    } = node;

    emptyNode(componentType);

    emptyNode(pipeContent);

    return node;
  },

  getNode() {
    let node = null;

    if (this.pool.length === 0) {
      node = this.generater();
    } else {
      const oldNode = this.pool.pop();

      node = this.format(oldNode);
    }

    return node;
  },

  returnNode(node) {
    this.pool.push(node);
  },
};

export default function template(typeName = 'none', content = null) {
  const that = {};
  const {
    pipeComponent, pipeContent, componentType, toggleBtn, deleteBtn,
  } = nodePool.getNode();
  let parentNode = null;

  // --------------------------------------------------------------

  if (typeof typeName !== 'string') {
    throw new Error('plesae set type with a string');
  }

  createTextNodeAndAppend(componentType, typeName);

  if (content === null) {
    throw new Error('plesae set content with a valid node');
  }

  pipeContent.appendChild(content);

  // --------------------------------------------------------------

  that.appendToParent = (node = null) => {
    if (node === null) {
      throw new Error('plesae set parent with a valid node');
    }

    node.appendChild(pipeComponent);

    parentNode = node;
  };

  that.removeFromParent = () => {
    if (parentNode === null) {
      throw new Error('plesae set parent before remove');
    }

    const removedNode = parentNode.removeChild(pipeComponent);

    nodePool.returnNode(removedNode);
  };

  that.toggleBtn = toggleBtn;

  that.deleteBtn = deleteBtn;

  // --------------------------------------------------------------

  return that;
}
