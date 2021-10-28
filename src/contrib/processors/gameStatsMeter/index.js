import Processor from '../../../engine/processor/processor';

const GAME_STATS_UPDATE_MSG = 'GAME_STATS_UPDATE';
const MS_IN_SEC = 1000;

export class GameStatsMeter extends Processor {
  constructor(options) {
    super();

    this._frequency = options.frequency || MS_IN_SEC;
    this._gameObjectObserver = options.gameObjectObserver;

    this._fps = 0;
    this._time = 0;
    this._messages = 0;

    this._skippedStateUpdate = 0;
    this._executedStateUpdate = 0;
  }

  process(options) {
    const {
      messageBus, deltaTime, skipped, executed,
    } = options;

    this._fps += 1;
    this._time += deltaTime;
    this._messages += messageBus.getMessageCount();

    if (skipped) {
      this._skippedStateUpdate += 1;
    } else {
      this._executedStateUpdate += executed;
    }

    if (this._time >= this._frequency) {
      messageBus.send({
        type: GAME_STATS_UPDATE_MSG,
        fps: (this._fps * MS_IN_SEC) / this._time,
        gameObjectsCount: this._gameObjectObserver.size(),
        messagesCount: (this._messages * MS_IN_SEC) / this._time,
        skippedStateUpdate: (this._skippedStateUpdate * MS_IN_SEC) / this._time,
        executedStateUpdate: (this._executedStateUpdate * MS_IN_SEC) / this._time,
      });

      this._fps = 0;
      this._time = 0;
      this._messages = 0;

      this._skippedStateUpdate = 0;
      this._executedStateUpdate = 0;
    }
  }
}
