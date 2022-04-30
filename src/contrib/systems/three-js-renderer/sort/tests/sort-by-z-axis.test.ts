import { Transform, TransformConfig } from '../../../../components/transform';
import { GameObject } from '../../../../../engine/game-object/game-object';

import { sortByZAxis } from '../sort-by-z-axis';

describe('Contrib -> RenderSystem -> Sort -> sortByZAxis()', () => {
  const baseTransformProps: TransformConfig = {
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
  };

  it('Returns correct order of objects', () => {
    const gameObject1 = new GameObject({ id: '1', name: 'mock-gameObject-1' });
    const gameObject2 = new GameObject({ id: '2', name: 'mock-gameObject-2' });

    gameObject1.setComponent('transform', new Transform('transform', baseTransformProps));
    gameObject2.setComponent('transform', new Transform('transform', baseTransformProps));

    expect(sortByZAxis(gameObject1, gameObject2)).toBe(0);

    (gameObject2.getComponent('transform') as Transform).offsetZ = 50;

    expect(sortByZAxis(gameObject1, gameObject2)).toBeLessThan(0);

    (gameObject1.getComponent('transform') as Transform).offsetZ = 100;

    expect(sortByZAxis(gameObject1, gameObject2)).toBeGreaterThan(0);
  });
});
