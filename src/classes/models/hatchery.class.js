import { config } from '../../config/config.js';
import { findMonsterByMonsters } from '../../db/game/game.db.js';
import BossMonster from './bossMonster.class.js';

class Hatchery {
  constructor(location) {
    this.players = [];

    this.initMonster(location);
  }

  async initMonster(location) {
    const monster = await findMonsterByMonsters(config.hatchery.bossId);
    const {
      monsterId,
      monsterName,
      monsterHp,
      monsterAttack,
      monsterExp,
      monsterEffect,
      monsterGold,
      monsterCritical,
      monsterCriticalAttack,
    } = monster;

    this.boss = new BossMonster(
      0,
      monsterId,
      monsterHp,
      monsterAttack,
      monsterName,
      monsterEffect,
      monsterExp,
      monsterGold,
      monsterCritical,
      monsterCriticalAttack,
      monsterHp,
      location,
    );
  }

  addPlayer(player) {
    if (this.players.length >= config.hatchery.maxPlayers) {
      throw new Error('게임 세션에 자리가 없습니다!');
    }
    this.players.push(player);
  }

  removePlayer(nickname) {
    this.players = this.players.filter((player) => player.nickname !== nickname);
  }
}

export default Hatchery;
