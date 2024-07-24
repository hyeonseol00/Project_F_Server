import { config } from '../../config/config.js';

class User {
  constructor(playerId, nickname, characterClass, socket) {
    this.playerId = playerId;
    this.nickname = nickname;
    this.characterClass = characterClass;
    this.socket = socket;
    this.lastUpdateTime = Date.now();
    this.battleSceneStatus = config.sceneStatus.message;
  }
}

export default User;
