import type { SceneProvider, SceneLoadOptions, LevelLoadOptions } from '../scene';
import type { Message } from '../message-bus';

import type { Controller, ControllerOptions } from './controller';

const LOAD_SCENE_MSG = 'LOAD_SCENE';
const LOAD_LEVEL_MSG = 'LOAD_LEVEL';

interface LoadSceneMessage extends Message, SceneLoadOptions {}

interface LoadLevelMessage extends Message, LevelLoadOptions {}

export class SceneController implements Controller {
  private sceneProvider: SceneProvider;

  constructor({ sceneProvider }: ControllerOptions) {
    this.sceneProvider = sceneProvider;
  }

  update(): void {
    const currentScene = this.sceneProvider.getCurrentScene();

    const messageBus = currentScene?.getMessageBus();

    const loadSceneMessages = messageBus?.get(LOAD_SCENE_MSG) || [];
    if (loadSceneMessages.length) {
      const {
        name,
        loader,
        level,
        clean,
        unloadCurrent,
      } = loadSceneMessages[loadSceneMessages.length - 1] as LoadSceneMessage;

      void this.sceneProvider.loadScene({
        name,
        loader,
        level,
        clean,
        unloadCurrent,
      });
    }

    const loadLevelMessages = messageBus?.get(LOAD_LEVEL_MSG) || [];
    if (loadLevelMessages.length) {
      const {
        name,
        loader,
      } = loadLevelMessages[loadLevelMessages.length - 1] as LoadLevelMessage;

      void this.sceneProvider.loadLevel({
        name,
        loader,
      });
    }

    if (this.sceneProvider.isLoaded()) {
      this.sceneProvider.moveToLoaded();
    }
  }
}