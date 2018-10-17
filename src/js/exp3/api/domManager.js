const doc = document;

const domManager = {
  getById(...ids) {
    const elements = {};

    ids.forEach((id) => {
      const elt = doc.getElementById(id);

      if (elt === null) {
        throw new Error(`No element with id: ${id}`);
      }

      elements[id] = elt;
    });

    return elements;
  },
};

export default domManager;
