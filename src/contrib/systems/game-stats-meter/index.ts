import { System } from '../../../engine/system';
import type { SystemOptions, UpdateOptions } from '../../../engine/system';
import type { Scene } from '../../../engine/scene';
import { GameStatsUpdate } from '../../events';
import { ActorCollection } from '../../../engine/actor';

const MS_IN_SEC = 1000;

interface GameStatsMeterOptions extends SystemOptions {
  frequency: number;
}

export class GameStatsMeter extends System {
  private scene: Scene;
  private actorCollection: ActorCollection;
  private frequency: number;
  private fps: number;
  private time: number;

  constructor(options: SystemOptions) {
    super();

    const {
      scene,
      frequency,
    } = options as GameStatsMeterOptions;

    this.scene = scene;
    this.actorCollection = new ActorCollection(scene);
    this.frequency = frequency || MS_IN_SEC;

    this.fps = 0;
    this.time = 0;
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;

    this.fps += 1;
    this.time += deltaTime;

    if (this.time >= this.frequency) {
      this.scene.dispatchEvent(GameStatsUpdate, {
        fps: (this.fps * MS_IN_SEC) / this.time,
        actorsCount: this.actorCollection.size,
      });

      this.fps = 0;
      this.time = 0;
    }
  }
}

GameStatsMeter.systemName = 'GameStatsMeter';
