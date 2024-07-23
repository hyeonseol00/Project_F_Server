import { config } from '../../config/config.js';

class InstanceDungeon {
  constructor(userId) {
    this.id = userId;
    this.battleSceneStatus = config.sceneStatus.message;
  }
}

export default InstanceDungeon;
