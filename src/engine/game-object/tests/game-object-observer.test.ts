/* comment: mock classes for test */
/* eslint-disable max-classes-per-file */
import { Scene } from '../../scene';
import { GameObjectObserver } from '../game-object-observer';
import { GameObjectCreator } from '../game-object-creator';
import { GameObject } from '../game-object';
import { TemplateCollection } from '../../template';
import { Component } from '../../component';

class TestComponent1 extends Component {
  static componentName = 'TestComponent1';

  clone(): Component {
    return new TestComponent1();
  }
}

class TestComponent2 extends Component {
  static componentName = 'TestComponent2';

  clone(): Component {
    return new TestComponent2();
  }
}

class TestComponent3 extends Component {
  static componentName = 'TestComponent3';

  clone(): Component {
    return new TestComponent3();
  }
}

describe('Engine -> GameObjectObserver', () => {
  let scene: Scene;

  let gameObject1: GameObject;
  let gameObject2: GameObject;
  let gameObject3: GameObject;
  let gameObject4: GameObject;
  let gameObject5: GameObject;

  beforeEach(() => {
    const templateCollection = new TemplateCollection([]);
    scene = new Scene({
      id: '000',
      name: 'test-scene',
      gameObjects: [],
      availableSystems: [],
      resources: {},
      globalOptions: {},
      systems: [],
      gameObjectCreator: new GameObjectCreator([], templateCollection),
      templateCollection,
      levelId: null,
    });

    gameObject1 = new GameObject({
      id: '1',
      name: 'game-object-1',
    });
    gameObject2 = new GameObject({
      id: '2',
      name: 'game-object-2',
    });
    gameObject3 = new GameObject({
      id: '3',
      name: 'game-object-3',
    });
    gameObject4 = new GameObject({
      id: '4',
      name: 'game-object-4',
    });
    gameObject5 = new GameObject({
      id: '5',
      name: 'game-object-5',
    });

    gameObject1.setComponent(new TestComponent1());

    gameObject2.setComponent(new TestComponent1());

    gameObject3.setComponent(new TestComponent2());

    gameObject4.setComponent(new TestComponent1());
    gameObject4.setComponent(new TestComponent2());

    gameObject5.setComponent(new TestComponent1());
    gameObject5.setComponent(new TestComponent2());
    gameObject5.setComponent(new TestComponent3());
  });

  it('Correct filters game objects by components', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: [TestComponent1, TestComponent2],
    });

    scene.addGameObject(gameObject1);
    scene.addGameObject(gameObject2);
    scene.addGameObject(gameObject3);
    scene.addGameObject(gameObject4);
    scene.addGameObject(gameObject5);

    expect(gameObjectObserver.size()).toEqual(2);

    const [id4, id5] = gameObjectObserver.map((gameObject) => gameObject.getId());
    expect(id4).toEqual('4');
    expect(id5).toEqual('5');

    const expectedIds = ['4', '5'];
    gameObjectObserver.forEach((gameObject, index) => {
      expect(gameObject.getId()).toEqual(expectedIds[index]);
    });
  });

  it('Correct subscribe on new game objects additions', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: [TestComponent1],
    });
    const testFn1 = jest.fn();
    const testFn2 = jest.fn();

    gameObjectObserver.subscribe('onadd', testFn1);
    gameObjectObserver.subscribe('onadd', testFn2);

    scene.addGameObject(gameObject1);

    expect(testFn1.mock.calls.length).toEqual(0);
    expect(testFn2.mock.calls.length).toEqual(0);

    gameObjectObserver.fireEvents();

    expect(testFn1.mock.calls.length).toEqual(1);
    expect(testFn1.mock.calls[0]).toEqual([gameObject1]);
    expect(testFn2.mock.calls.length).toEqual(1);
    expect(testFn2.mock.calls[0]).toEqual([gameObject1]);
    expect(gameObjectObserver.size()).toEqual(1);

    scene.addGameObject(gameObject3);
    gameObjectObserver.fireEvents();

    expect(testFn1.mock.calls.length).toEqual(1);
    expect(testFn2.mock.calls.length).toEqual(1);
    expect(gameObjectObserver.size()).toEqual(1);

    gameObject3.setComponent(new TestComponent1());
    gameObjectObserver.fireEvents();

    expect(testFn1.mock.calls.length).toEqual(2);
    expect(testFn1.mock.calls[1]).toEqual([gameObject3]);
    expect(testFn2.mock.calls.length).toEqual(2);
    expect(testFn2.mock.calls[1]).toEqual([gameObject3]);
    expect(gameObjectObserver.size()).toEqual(2);

    scene.addGameObject(gameObject4);
    scene.addGameObject(gameObject5);
    gameObjectObserver.fireEvents();

    expect(testFn1.mock.calls.length).toEqual(4);
    expect(testFn1.mock.calls[2]).toEqual([gameObject4]);
    expect(testFn1.mock.calls[3]).toEqual([gameObject5]);
    expect(testFn2.mock.calls.length).toEqual(4);
    expect(testFn2.mock.calls[2]).toEqual([gameObject4]);
    expect(testFn2.mock.calls[3]).toEqual([gameObject5]);
    expect(gameObjectObserver.size()).toEqual(4);
  });

  it('Correct subscribe on new game objects removes', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: [TestComponent1],
    });

    const testFn1 = jest.fn();
    const testFn2 = jest.fn();

    gameObjectObserver.subscribe('onremove', testFn1);
    gameObjectObserver.subscribe('onremove', testFn2);

    scene.addGameObject(gameObject1);
    scene.addGameObject(gameObject2);
    scene.addGameObject(gameObject3);
    scene.addGameObject(gameObject4);
    scene.addGameObject(gameObject5);

    gameObjectObserver.fireEvents();

    expect(testFn1.mock.calls.length).toEqual(0);
    expect(testFn2.mock.calls.length).toEqual(0);
    expect(gameObjectObserver.size()).toEqual(4);

    gameObject1.removeComponent(TestComponent1);
    gameObjectObserver.fireEvents();

    expect(testFn1.mock.calls.length).toEqual(1);
    expect(testFn1.mock.calls[0]).toEqual([gameObject1]);
    expect(testFn2.mock.calls.length).toEqual(1);
    expect(testFn2.mock.calls[0]).toEqual([gameObject1]);
    expect(gameObjectObserver.size()).toEqual(3);

    scene.removeGameObject(gameObject4);
    gameObject5.removeComponent(TestComponent1);
    gameObjectObserver.fireEvents();

    expect(testFn1.mock.calls.length).toEqual(3);
    expect(testFn1.mock.calls[1]).toEqual([gameObject4]);
    expect(testFn1.mock.calls[2]).toEqual([gameObject5]);
    expect(testFn2.mock.calls.length).toEqual(3);
    expect(testFn2.mock.calls[1]).toEqual([gameObject4]);
    expect(testFn2.mock.calls[2]).toEqual([gameObject5]);
    expect(gameObjectObserver.size()).toEqual(1);
  });

  it('Correct unsubscribe from game object observer events', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: [TestComponent1],
    });

    const testFn = jest.fn();

    gameObjectObserver.subscribe('onadd', testFn);

    scene.addGameObject(gameObject1);
    gameObjectObserver.fireEvents();

    expect(testFn.mock.calls.length).toEqual(1);

    gameObjectObserver.unsubscribe('onadd', testFn);

    scene.addGameObject(gameObject4);
    gameObjectObserver.fireEvents();

    expect(testFn.mock.calls.length).toEqual(1);
  });

  it('Correct returns game objects by id and index', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: [TestComponent1, TestComponent2],
    });

    scene.addGameObject(gameObject1);
    scene.addGameObject(gameObject2);
    scene.addGameObject(gameObject3);
    scene.addGameObject(gameObject4);
    scene.addGameObject(gameObject5);

    expect(gameObjectObserver.getByIndex(0)).toEqual(gameObject4);
    expect(gameObjectObserver.getByIndex(1)).toEqual(gameObject5);

    expect(gameObjectObserver.getById('4')).toEqual(gameObject4);
    expect(gameObjectObserver.getById('5')).toEqual(gameObject5);

    expect(gameObjectObserver.getById('1')).toEqual(void 0);
    expect(gameObjectObserver.getById('2')).toEqual(void 0);
    expect(gameObjectObserver.getById('3')).toEqual(void 0);
  });

  it('Correct sorts game objects', () => {
    const gameObjectObserver = new GameObjectObserver(scene, {
      components: [TestComponent1],
    });

    scene.addGameObject(gameObject5);
    scene.addGameObject(gameObject4);
    scene.addGameObject(gameObject2);
    scene.addGameObject(gameObject3);
    scene.addGameObject(gameObject1);

    const unsortedIds = ['5', '4', '2', '1'];
    gameObjectObserver.forEach((gameObject, index) => {
      expect(gameObject.getId()).toEqual(unsortedIds[index]);
    });

    gameObjectObserver.sort((a, b) => {
      if (a.getId() < b.getId()) { return -1; }
      if (a.getId() > b.getId()) { return 1; }
      return 0;
    });

    const sortedIds = ['1', '2', '4', '5'];
    gameObjectObserver.forEach((gameObject, index) => {
      expect(gameObject.getId()).toEqual(sortedIds[index]);
    });
  });
});
