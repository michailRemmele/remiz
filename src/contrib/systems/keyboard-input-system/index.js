import InputListener from './inputListener';
import KeyCodeMapper from './keyCodeMapper';

const INPUT_MESSAGE = 'INPUT_EVENT_QUERY';

const PRESS_EVENT_TYPE = 'PRESSED';
const RELEASE_EVENT_TYPE = 'RELEASED';

const PREFIX_SEPARATOR = '_';

export class KeyboardInputSystem {
  constructor(options) {
    this.messageBus = options.messageBus;
    this._inputListener = new InputListener(window);
    this._keyCodeMapper = new KeyCodeMapper();

    this._events = [
      {
        type: PRESS_EVENT_TYPE,
        getKeys: () => this._inputListener.getPressedKeys(),
        onProcessComplete: () => this._inputListener.clearPressedKeys(),
      },
      {
        type: RELEASE_EVENT_TYPE,
        getKeys: () => this._inputListener.getReleasedKeys(),
        onProcessComplete: () => this._inputListener.clearReleasedKeys(),
      },
    ];
  }

  systemDidMount() {
    this._inputListener.startListen();
  }

  systemWillUnmount() {
    this._inputListener.stopListen();
  }

  update() {
    const eventQuery = [];

    this._events.forEach((event) => {
      event.getKeys().forEach((keyCode) => {
        eventQuery.push(`${this._keyCodeMapper.getChar(keyCode)}${PREFIX_SEPARATOR}${event.type}`);
      });

      event.onProcessComplete();
    });

    this.messageBus.send({
      type: INPUT_MESSAGE,
      query: eventQuery,
    });
  }
}