import { Sprite, SpriteConfig } from '../../../../components/sprite';
import { Transform, TransformConfig } from '../../../../components/transform';
import { GameObject } from '../../../../../engine/game-object/game-object';

import { sortByYAxis } from '../sort-by-y-axis';

describe('Contrib -> RenderSystem -> Sort -> sortByYAxis()', () => {
  const baseSpriteProps: SpriteConfig = {
    src: 'some-path',
    width: 0,
    height: 0,
    sortCenter: [0, 0],
    slice: 1,
    rotation: 0,
    flipX: false,
    flipY: false,
    disabled: false,
    sortingLayer: 'some-layer',
    fit: 'stretch',
    material: {
      type: 'basic',
    },
  };
  const baseTransformProps: TransformConfig = {
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  };

  it('Returns correct order of objects while equals height', () => {
    const gameObject1 = new GameObject({ id: '1', name: 'mock-game-object-1' });
    const gameObject2 = new GameObject({ id: '2', name: 'mock-game-object-2' });

    gameObject1.setComponent(new Sprite(baseSpriteProps));
    gameObject1.setComponent(new Transform(baseTransformProps));

    gameObject2.setComponent(new Sprite(baseSpriteProps));
    gameObject2.setComponent(new Transform(baseTransformProps));

    expect(sortByYAxis(gameObject1, gameObject2)).toBe(0);

    (gameObject2.getComponent(Transform)).offsetY = 50;

    expect(sortByYAxis(gameObject1, gameObject2)).toBeLessThan(0);

    (gameObject1.getComponent(Transform)).offsetY = 100;

    expect(sortByYAxis(gameObject1, gameObject2)).toBeGreaterThan(0);
  });

  it('Returns correct order of objects while different height', () => {
    const gameObject1 = new GameObject({ id: '1', name: 'mock-game-object-1' });
    const gameObject2 = new GameObject({ id: '2', name: 'mock-game-object-2' });

    gameObject1.setComponent(new Sprite(baseSpriteProps));
    gameObject1.setComponent(new Transform(baseTransformProps));

    gameObject2.setComponent(new Sprite(baseSpriteProps));
    gameObject2.setComponent(new Transform(baseTransformProps));

    (gameObject1.getComponent(Transform)).offsetY = 100;
    (gameObject2.getComponent(Transform)).offsetY = 50;

    (gameObject1.getComponent(Sprite)).height = 10;
    (gameObject2.getComponent(Sprite)).height = 100;

    expect(sortByYAxis(gameObject1, gameObject2)).toBeGreaterThan(0);

    (gameObject2.getComponent(Sprite)).height = 110;

    expect(sortByYAxis(gameObject1, gameObject2)).toBe(0);

    (gameObject2.getComponent(Sprite)).height = 130;

    expect(sortByYAxis(gameObject1, gameObject2)).toBeLessThan(0);
  });
});