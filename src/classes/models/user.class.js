import { config } from '../../config/config.js';

class User {
  constructor(id, playerId, characterClass, socket) {
    this.id = id;
    this.playerId = playerId;
    this.characterClass = characterClass;
    this.socket = socket;
    this.lastUpdateTime = Date.now();
    this.battleSceneStatus = config.sceneStatus.message;
  }
}

export default User;
