import AIStrategy from './aiStrategy';

const SHOT_MSG = 'SHOT';

const PLATFORM_SIZE_NAME = 'platformSize';
const PLAYERS_ENEMIES_NAME = 'playersEnemies';

const TRANSFORM_COMPONENT_NAME = 'transform';

class EasyAIStrategy extends AIStrategy{
  constructor(player, store) {
    super();

    this._player = player;
    this._store = store;

    this._playerId = this._player.getId();
  }

  update(messageBus, deltaTime) {
    const platformSize = this._store.get(PLATFORM_SIZE_NAME);
    const playerEnemies = this._store.get(PLAYERS_ENEMIES_NAME)[this._playerId];

    if (!playerEnemies.length) {
      return;
    }

    const enemy = playerEnemies[Math.floor(Math.random() * playerEnemies.length)];
    const { offsetX: enemyX, offsetY: enemyY } = enemy.getComponent(TRANSFORM_COMPONENT_NAME);

    messageBus.send({
      gameObject: this._player,
      type: SHOT_MSG,
      x: enemyX,
      y: enemyY,
    });
  }
}

export default EasyAIStrategy;
