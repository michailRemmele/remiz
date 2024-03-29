import { RigidBody } from '../index';

describe('Contrib -> components -> RigidBody', () => {
  it('Returns correct values ', () => {
    const rigidBody = new RigidBody({
      type: 'dynamic',
      mass: 10,
      useGravity: true,
      isPermeable: false,
      ghost: false,
      drag: 1,
    }).clone();

    expect(rigidBody.type).toEqual('dynamic');
    expect(rigidBody.mass).toEqual(10);
    expect(rigidBody.useGravity).toEqual(true);
    expect(rigidBody.isPermeable).toEqual(false);
    expect(rigidBody.ghost).toEqual(false);
    expect(rigidBody.drag).toEqual(1);
  });

  it('Correct updates values ', () => {
    const rigidBody = new RigidBody({
      type: 'dynamic',
      mass: 10,
      useGravity: true,
      isPermeable: false,
      ghost: false,
      drag: 1,
    }).clone();

    rigidBody.type = 'static';
    rigidBody.mass = 20;
    rigidBody.useGravity = false;
    rigidBody.isPermeable = true;
    rigidBody.ghost = true;
    rigidBody.drag = 2;

    expect(rigidBody.type).toEqual('static');
    expect(rigidBody.mass).toEqual(20);
    expect(rigidBody.useGravity).toEqual(false);
    expect(rigidBody.isPermeable).toEqual(true);
    expect(rigidBody.ghost).toEqual(true);
    expect(rigidBody.drag).toEqual(2);
  });

  it('Clones return deep copy of original component', () => {
    const originalRigidBody = new RigidBody({
      type: 'dynamic',
      mass: 10,
      useGravity: true,
      isPermeable: false,
      ghost: false,
      drag: 1,
    });
    const cloneRigidBody = originalRigidBody.clone();

    expect(originalRigidBody).not.toBe(cloneRigidBody);
  });
});
