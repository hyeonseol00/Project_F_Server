import { config } from '../../config/config.js';
import { getDungeonItems, getPotionItem } from '../../db/game/game.db.js';
import Item from './item.class.js';
import Monster from './monster.class.js';

class InstanceDungeon {
  constructor(userId, player, dungeonCode) {
    this.id = userId;
    this.player = player;
    this.monsters = [];
    this.battleSceneStatus = config.sceneStatus.message;
    this.targetMonsterIdx = 0;
    this.currentAttackType = config.attackType.normal;
    this.pushDungeonItems(dungeonCode);
    this.selectItem = null;
  }

  addMonster(idx, id, hp, power, name, effectCode, exp, gold, critical, criticalAttack) {
    const monster = new Monster(
      idx,
      id,
      hp,
      power,
      name,
      effectCode,
      exp,
      gold,
      critical,
      criticalAttack,
    );
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

  isMonstersAllDead() {
    const result = this.monsters.find((monster) => monster.isDead === false);

    if (result === undefined) {
      return true;
    } else {
      return false;
    }
  }

  async pushDungeonItems(dungeonCode) {
    this.items = [];
    const dungeonItems = await getDungeonItems(dungeonCode + 5000);
    for (const item of dungeonItems) {
      item.isPotion = item.isPotion && item.isPotion[0] === 1;
      if (item.isPotion) {
        const potionInfo = await getPotionItem(item.itemId);
        const potion = new Item(
          potionInfo.name,
          potionInfo.hpHealingAmount,
          potionInfo.mpHealingAmount,
          potionInfo.expHealingAmount,
          dungeonCode, // quantity: 1던전에선 포션 1개, 4던전에선 4개 지급
        );
        this.items.push(potion);
      }
    }
    console.log(this.items);
  }

  getRandomItem() {
    const itemIdx = Math.floor(Math.random() * this.items.length);

    return this.items[itemIdx];
  }
}

export default InstanceDungeon;
