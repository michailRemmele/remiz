import { KeyboardControl } from '../index';

describe('Contrib -> components -> KeyboardControl', () => {
  it('Returns correct values ', () => {
    const keyboardControl = new KeyboardControl('keyboardControl', {
      inputEventBindings: {
        W_PRESSED: {
          messageType: 'RUN',
          attrs: {
            angle: 270,
          },
        },
        I_RELEASED: {
          messageType: 'INVENTORY_OPEN',
          attrs: {},
        },
      },
    }).clone();

    expect(keyboardControl.inputEventBindings.W_PRESSED).toStrictEqual({
      messageType: 'RUN',
      attrs: {
        angle: 270,
      },
    });
    expect(keyboardControl.inputEventBindings.I_RELEASED).toStrictEqual({
      messageType: 'INVENTORY_OPEN',
      attrs: {},
    });
    expect(keyboardControl.keyStates).toStrictEqual({
      W: null,
      I: null,
    });
  });

  it('Correct updates values ', () => {
    const keyboardControl = new KeyboardControl('keyboardControl', {
      inputEventBindings: {
        W_PRESSED: {
          messageType: 'WALK',
          attrs: {
            angle: 90,
          },
        },
      },
    }).clone();

    keyboardControl.inputEventBindings = {
      W_PRESSED: {
        messageType: 'WALK',
        attrs: {
          angle: 90,
        },
      },
    };
    keyboardControl.keyStates.W = 'PRESSED';

    expect(keyboardControl.inputEventBindings.W_PRESSED).toStrictEqual({
      messageType: 'WALK',
      attrs: {
        angle: 90,
      },
    });
    expect(keyboardControl.keyStates).toStrictEqual({
      W: 'PRESSED',
    });
  });
});