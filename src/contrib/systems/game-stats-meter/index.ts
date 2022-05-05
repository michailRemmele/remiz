import type { System, SystemOptions, UpdateOptions } from '../../../engine/system';
import type { GameObjectObserver } from '../../../engine/game-object';
import type { MessageBus } from '../../../engine/message-bus';

const GAME_STATS_UPDATE_MSG = 'GAME_STATS_UPDATE';
const MS_IN_SEC = 1000;

interface GameStatsMeterOptions extends SystemOptions {
  frequency: number;
}

export class GameStatsMeter implements System {
  private gameObjectObserver: GameObjectObserver;
  private messageBus: MessageBus;
  private frequency: number;
  private fps: number;
  private time: number;
  private messages: number;

  constructor(options: GameStatsMeterOptions) {
    this.gameObjectObserver = options.createGameObjectObserver({});
    this.messageBus = options.messageBus;
    this.frequency = options.frequency || MS_IN_SEC;

    this.fps = 0;
    this.time = 0;
    this.messages = 0;
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.fps += 1;
    this.time += deltaTime;
    this.messages += this.messageBus.getMessageCount();

    if (this.time >= this.frequency) {
      this.messageBus.send({
        type: GAME_STATS_UPDATE_MSG,
        fps: (this.fps * MS_IN_SEC) / this.time,
        gameObjectsCount: this.gameObjectObserver.size(),
        messagesCount: (this.messages * MS_IN_SEC) / this.time,
      });

      this.fps = 0;
      this.time = 0;
      this.messages = 0;
    }
  }
}