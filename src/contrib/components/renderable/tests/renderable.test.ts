import { Renderable } from '../index';

describe('Contrib -> components -> Renderable', () => {
  it('Returns correct values ', () => {
    const renderable = new Renderable('renderable', {
      src: 'some-path-to-texture',
      type: 'sprite',
      width: 100,
      height: 200,
      slice: 10,
      spacing: 5,
      extruding: 2,
      rotation: 45,
      origin: [0, 0],
      flipX: false,
      flipY: true,
      disabled: false,
      sortingLayer: 'terrain',
    }).clone();

    expect(renderable.src).toEqual('some-path-to-texture');
    expect(renderable.type).toEqual('sprite');
    expect(renderable.width).toEqual(100);
    expect(renderable.height).toEqual(200);
    expect(renderable.slice).toEqual(10);
    expect(renderable.spacing).toEqual(5);
    expect(renderable.extruding).toEqual(2);
    expect(renderable.rotation).toEqual(45);
    expect(renderable.origin).toEqual([-50, -100]);
    expect(renderable.flipX).toEqual(false);
    expect(renderable.flipY).toEqual(true);
    expect(renderable.disabled).toEqual(false);
    expect(renderable.sortingLayer).toEqual('terrain');
  });

  it('Correct updates values ', () => {
    const renderable = new Renderable('renderable', {
      src: 'some-path-to-texture',
      type: 'sprite',
      width: 100,
      height: 200,
      slice: 10,
      spacing: 5,
      extruding: 2,
      rotation: 45,
      origin: [0, 0],
      flipX: false,
      flipY: true,
      disabled: false,
      sortingLayer: 'terrain',
    }).clone();

    renderable.src = 'another-path-to-texture';
    renderable.type = 'static';
    renderable.width = 200;
    renderable.height = 400;
    renderable.slice = void 0;
    renderable.spacing = 3;
    renderable.extruding = 2;
    renderable.rotation = 90;
    renderable.origin = [5, 10];
    renderable.flipX = true;
    renderable.flipY = false;
    renderable.disabled = true;
    renderable.sortingLayer = 'units';

    expect(renderable.src).toEqual('another-path-to-texture');
    expect(renderable.type).toEqual('static');
    expect(renderable.width).toEqual(200);
    expect(renderable.height).toEqual(400);
    expect(renderable.slice).toEqual(void 0);
    expect(renderable.spacing).toEqual(3);
    expect(renderable.extruding).toEqual(2);
    expect(renderable.rotation).toEqual(90);
    expect(renderable.origin).toEqual([-95, -190]);
    expect(renderable.flipX).toEqual(true);
    expect(renderable.flipY).toEqual(false);
    expect(renderable.disabled).toEqual(true);
    expect(renderable.sortingLayer).toEqual('units');
  });
});