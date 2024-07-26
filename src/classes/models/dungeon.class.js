import { config } from '../../config/config.js';
import Monster from './monster.class.js';

class InstanceDungeon {
  constructor(userId, player) {
    this.id = userId;
    this.player = player;
    this.monsters = [];
    this.battleSceneStatus = config.sceneStatus.message;
    this.targetMonsterIdx = 0;
  }

  addMonster(idx, id, hp, power, name) {
    const monster = new Monster(idx, id, hp, power, name);
    this.monsters.push(monster);
  }

  removeMonster(idx) {
    const target = this.monsters.findIndex((monster) => monster.idx == idx);
    this.monsters.splice(target, 1);
  }

  initTargetIdx() {
    this.targetMonsterIdx = 0;
  }

  accTargetIdx() {
    this.targetMonsterIdx++;

    return this.targetMonsterIdx;
  }

  setTargetIdx(idx) {
    this.targetMonsterIdx = idx;
  }

  getAliveIdx() {
    const idx = this.monsters.findIndex((monster) => monster.isDead === false);

    return idx;
  }
}

export default InstanceDungeon;
