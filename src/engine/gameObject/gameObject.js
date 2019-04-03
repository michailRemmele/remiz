class GameObject {
  constructor(id, sortingLayer) {
    this._id = id;
    this._sortingLayer = sortingLayer;
    this._components = {};
  }

  getId() {
    return this._id;
  }

  getSortingLayer() {
    return this._sortingLayer;
  }

  setComponent(name, component) {
    this._components[name] = component;
  }

  getComponent(name) {
    /**
     * TODO: return it back when the iteration through game objects will be fixed
     */
    /* if (!this._components[name]) {
      throw new Error(`Can't find component with the following name: ${name}`);
    } */

    return this._components[name];
  }

  removeComponent(name) {
    this._components[name] = undefined;
  }
}

export default GameObject;