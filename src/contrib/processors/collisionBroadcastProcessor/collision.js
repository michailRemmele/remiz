const STATE = {
  2: 'ENTER',
  1: 'STAY',
  0: 'LEAVE',
};

class Collision {
  constructor(gameObject, otherGameObject) {
    this._gameObject = gameObject;
    this._otherGameObject = otherGameObject;
    this._lifetime = 2;
  }

  set gameObject(gameObject) {
    this._gameObject = gameObject;
  }

  get gameObject() {
    return this._gameObject;
  }

  set otherGameObject(otherGameObject) {
    this._otherGameObject = otherGameObject;
  }

  get otherGameObject() {
    return this._otherGameObject;
  }

  isFinished() {
    return this._lifetime < 0;
  }

  signal() {
    this._lifetime = 1;
  }

  tick() {
    this._lifetime -= 1;
  }

  getState() {
    return STATE[this._lifetime];
  }
}

export default Collision;