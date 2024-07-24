import { config } from '../../config/config.js';
import Monster from './monster.class.js';

class InstanceDungeon {
  constructor(userId) {
    this.id = userId;
    this.monsters = [];
    this.battleSceneStatus = config.sceneStatus.message;
    this.btns = [];
  }

  addMonster(idx, id, hp, power, name) {
    const monster = new Monster(idx, id, hp, power, name);
    this.monsters.push(monster);
  }

  removeMonster(idx) {
    const target = this.monsters.findIndex((monster) => monster.idx == idx);
    this.monsters.slice(target, 1);
  }
}

export default InstanceDungeon;
