import { Sprite } from '../index';

describe('Contrib -> components -> Sprite', () => {
  it('Returns correct values ', () => {
    const sprite = new Sprite({
      src: 'some-path-to-texture',
      width: 100,
      height: 200,
      slice: 10,
      rotation: 45,
      sortCenter: [0, 0],
      flipX: false,
      flipY: true,
      disabled: false,
      sortingLayer: 'terrain',
      fit: 'stretch',
      material: {
        type: 'basic',
      },
    }).clone();

    expect(sprite.src).toEqual('some-path-to-texture');
    expect(sprite.width).toEqual(100);
    expect(sprite.height).toEqual(200);
    expect(sprite.slice).toEqual(10);
    expect(sprite.rotation).toEqual(45);
    expect(sprite.sortCenter).toEqual([0, 0]);
    expect(sprite.flipX).toEqual(false);
    expect(sprite.flipY).toEqual(true);
    expect(sprite.disabled).toEqual(false);
    expect(sprite.sortingLayer).toEqual('terrain');
    expect(sprite.fit).toEqual('stretch');
    expect(sprite.material.type).toEqual('basic');
  });

  it('Correct updates values ', () => {
    const sprite = new Sprite({
      src: 'some-path-to-texture',
      width: 100,
      height: 200,
      slice: 10,
      rotation: 45,
      sortCenter: [0, 0],
      flipX: false,
      flipY: true,
      disabled: false,
      sortingLayer: 'terrain',
      fit: 'stretch',
      material: {
        type: 'basic',
      },
    }).clone();

    sprite.src = 'another-path-to-texture';
    sprite.width = 200;
    sprite.height = 400;
    sprite.slice = 55;
    sprite.rotation = 90;
    sprite.sortCenter = [5, 10];
    sprite.flipX = true;
    sprite.flipY = false;
    sprite.disabled = true;
    sprite.sortingLayer = 'units';
    sprite.fit = 'repeat';
    sprite.material.type = 'lightsensitive';
    sprite.material.options.color = '#000';
    sprite.material.options.blending = 'multiply';

    expect(sprite.src).toEqual('another-path-to-texture');
    expect(sprite.width).toEqual(200);
    expect(sprite.height).toEqual(400);
    expect(sprite.slice).toEqual(55);
    expect(sprite.rotation).toEqual(90);
    expect(sprite.sortCenter).toEqual([5, 10]);
    expect(sprite.flipX).toEqual(true);
    expect(sprite.flipY).toEqual(false);
    expect(sprite.disabled).toEqual(true);
    expect(sprite.sortingLayer).toEqual('units');
    expect(sprite.fit).toEqual('repeat');
    expect(sprite.material.type).toEqual('lightsensitive');
    expect(sprite.material.options.color).toEqual('#000');
    expect(sprite.material.options.blending).toEqual('multiply');
  });

  it('Clones return deep copy of original component', () => {
    const originalSprite = new Sprite({
      src: 'some-path-to-texture',
      width: 100,
      height: 200,
      slice: 10,
      rotation: 45,
      sortCenter: [0, 0],
      flipX: false,
      flipY: true,
      disabled: false,
      sortingLayer: 'terrain',
      fit: 'stretch',
      material: {
        type: 'basic',
      },
    });
    const cloneSprite = originalSprite.clone();

    expect(originalSprite).not.toBe(cloneSprite);
    expect(originalSprite.sortCenter).not.toBe(cloneSprite.sortCenter);
  });
});
