import { MouseControl } from '../index';

describe('Contrib -> components -> MouseControl', () => {
  it('Returns correct values ', () => {
    const mouseControl = new MouseControl('mouseControl', {
      inputEventBindings: {
        MOUSE_LEFT_BUTTON_PRESS: {
          messageType: 'ATTACK',
          attrs: {
            someOption: 10,
          },
        },
        MOUSE_RIGHT_BUTTON_PRESS: {
          messageType: 'BLOCK',
          attrs: {
            someOption: 20,
          },
        },
      },
    }).clone();

    expect(mouseControl.inputEventBindings.MOUSE_LEFT_BUTTON_PRESS).toStrictEqual({
      messageType: 'ATTACK',
      attrs: {
        someOption: 10,
      },
    });
    expect(mouseControl.inputEventBindings.MOUSE_RIGHT_BUTTON_PRESS).toStrictEqual({
      messageType: 'BLOCK',
      attrs: {
        someOption: 20,
      },
    });
  });

  it('Correct updates values ', () => {
    const mouseControl = new MouseControl('mouseControl', {
      inputEventBindings: {
        MOUSE_LEFT_BUTTON_PRESS: {
          messageType: 'ATTACK',
          attrs: {
            someOption: 10,
          },
        },
      },
    }).clone();

    mouseControl.inputEventBindings = {
      MOUSE_RIGHT_BUTTON_PRESS: {
        messageType: 'BLOCK',
        attrs: {
          someOption: 20,
        },
      },
    };

    expect(mouseControl.inputEventBindings.MOUSE_RIGHT_BUTTON_PRESS).toStrictEqual({
      messageType: 'BLOCK',
      attrs: {
        someOption: 20,
      },
    });
  });
});