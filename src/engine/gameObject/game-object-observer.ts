import {
  GAME_OBJECT_ADDED,
  Scene,
  GameObjectChangeEvent,
} from '../scene';

import { GameObject } from './game-object';

export interface GameObjectObserverFilter {
  type?: string;
  components?: Array<string>;
}

export class GameObjectObserver {
  private _components: Array<string>;
  private _type?: string;
  private _observedGameObjects: Array<GameObject>;
  private _addedToAccepted: Array<GameObject>;
  private _removedFromAccepted: Array<GameObject>;
  private _acceptedGameObjects: Array<GameObject>;
  private _acceptedGameObjectsMap: Record<string, GameObject | undefined>;

  constructor(scene: Scene, filter: GameObjectObserverFilter) {
    const {
      type,
      components = [],
    } = filter;

    this._components = components;
    this._type = type;
    this._observedGameObjects = scene.getGameObjects();
    this._addedToAccepted = [];
    this._removedFromAccepted = [];
    this._acceptedGameObjectsMap = {};
    this._acceptedGameObjects = this._observedGameObjects.filter((gameObject) => {
      gameObject.subscribe(this._subscribeGameObject.bind(this));

      if (!this._test(gameObject)) {
        return false;
      }

      this._acceptedGameObjectsMap[gameObject.getId()] = gameObject;
      this._addedToAccepted.push(gameObject);

      return true;
    });

    scene.subscribeOnGameObjectsChange((event) => {
      const { gameObject } = event;

      if (event.type === GAME_OBJECT_ADDED) {
        gameObject.subscribe(this._subscribeGameObject.bind(this));
        this._add(gameObject);
      } else {
        this._remove(gameObject);
      }
    });
  }

  private _subscribeGameObject(event: GameObjectChangeEvent) {
    const { gameObject } = event;

    if (this._test(gameObject)) {
      this._accept(gameObject);
    } else {
      this._decline(gameObject);
    }
  }

  private _add(gameObject: GameObject) {
    this._observedGameObjects.push(gameObject);

    if (this._test(gameObject)) {
      this._accept(gameObject);
    }
  }

  private _remove(gameObject: GameObject) {
    const remove = (gameObjects: Array<GameObject>, id: string) => gameObjects.filter(
      (item) => id !== item.getId(),
    );

    const gameObjectId = gameObject.getId();

    this._observedGameObjects = remove(this._observedGameObjects, gameObjectId);
    this._acceptedGameObjects = remove(this._acceptedGameObjects, gameObjectId);
    this._acceptedGameObjectsMap[gameObjectId] = void 0;

    this._removedFromAccepted.push(gameObject);
  }

  private _test(gameObject: GameObject) {
    const type = gameObject.getType();

    if (this._type && this._type !== type) {
      return false;
    }

    return this._components.every((component) => gameObject.getComponent(component));
  }

  private _accept(gameObject: GameObject) {
    const gameObjectId = gameObject.getId();

    if (this._acceptedGameObjectsMap[gameObjectId]) {
      return;
    }

    this._acceptedGameObjects.push(gameObject);
    this._acceptedGameObjectsMap[gameObjectId] = gameObject;

    this._addedToAccepted.push(gameObject);
  }

  private _decline(gameObject: GameObject) {
    const gameObjectId = gameObject.getId();

    if (!this._acceptedGameObjectsMap[gameObjectId]) {
      return;
    }

    this._acceptedGameObjects = this._acceptedGameObjects.filter(
      (acceptedGameObject) => gameObjectId !== acceptedGameObject.getId(),
    );
    this._acceptedGameObjectsMap[gameObjectId] = void 0;

    this._removedFromAccepted.push(gameObject);
  }

  size() {
    return this._acceptedGameObjects.length;
  }

  getLastRemoved() {
    const lastRemoved = this._removedFromAccepted;
    this._removedFromAccepted = [];

    return lastRemoved;
  }

  getLastAdded() {
    const lastAdded = this._addedToAccepted;
    this._addedToAccepted = [];

    return lastAdded;
  }

  getById(id: string) {
    return this._acceptedGameObjectsMap[id];
  }

  getByIndex(index: number) {
    return this._acceptedGameObjects[index];
  }

  forEach(callback: (gameObject: GameObject, index: number) => void) {
    this._acceptedGameObjects.forEach(callback);
  }

  map(callback: (gameObject: GameObject, index: number) => unknown) {
    return this._acceptedGameObjects.map(callback);
  }

  sort(compareFunction: (a: GameObject, b: GameObject) => number) {
    this._acceptedGameObjects = this._acceptedGameObjects.sort(compareFunction);
  }
}