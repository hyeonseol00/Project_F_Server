import { config } from '../../config/config.js';
import { findMonsterByMonsters } from '../../db/game/game.db.js';
import { createResponse } from '../../utils/response/createResponse.js';
import toEulerAngles from '../../utils/toEulerAngle.js';
import IntervalManager from '../managers/interval.manager.js';
import BossMonster from './bossMonster.class.js';

class Hatchery {
  constructor(transform) {
    this.players = [];
    this.intervalManager = new IntervalManager();
    this.lastUnitVector = { x: 0, z: 0 };

    this.initMonster(transform);
  }

  async initMonster(transform) {
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
      monsterSpeed,
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
      transform,
      monsterSpeed || 3.0, // monsterSpeed
    );
  }

  addPlayer(player) {
    if (this.players.length >= config.hatchery.maxPlayers) {
      throw new Error('게임 세션에 자리가 없습니다!');
    } else if (this.players.length <= 0) {
      this.intervalManager.addPlayer(
        config.hatchery.bossTargetIntervalId,
        () => this.bossMove(),
        config.hatchery.bossTargetInterval,
        'monster',
      );
      this.lastUpdateTime = Date.now();
    }
    this.players.push(player);
  }

  removePlayer(nickname) {
    this.players = this.players.filter((player) => player.nickname !== nickname);

    if (this.players.length <= 0) {
      this.intervalManager.removePlayer(config.hatchery.bossTargetIntervalId);
    }
  }

  bossMove() {
    if (this.players.length <= 0) {
      return;
    }

    const bossTr = this.boss.transform;
    let targetPlayerTr = this.players[0].playerInfo.transform;
    let minDistance = 2e9;

    // 플레이어들과 몬스터 간의 거리 계산
    for (const player of this.players) {
      const playerTr = player.playerInfo.transform;
      const distance = this.boss.getDistanceFromPlayer(playerTr);
      if (minDistance > distance) {
        minDistance = distance;
        targetPlayerTr = playerTr;
      }
    }

    // 여기 부분에 현재 위치 계산
    const lastUnitVec = this.lastUnitVector;
    const elapsedTime = Date.now() - this.lastUpdateTime;
    const timeDiff = elapsedTime / 1000;
    const speed = this.boss.speed;
    bossTr.posX += lastUnitVec.x * timeDiff * speed;
    bossTr.posZ += lastUnitVec.z * timeDiff * speed;

    // 타겟 플레이어에 대한 몬스터의 방향 벡터 계산
    const unitVec = this.boss.getUnitVectorFromPlayer(targetPlayerTr);
    const rot = toEulerAngles(unitVec);
    bossTr.rot = rot - 90;

    const bossUnitVector = { unitX: unitVec.x, unitZ: unitVec.z };
    const bossMoveResponse = createResponse('response', 'S_BossMove', {
      bossTransform: bossTr,
      bossUnitVector,
    });

    for (const player of this.players) {
      player.socket.write(bossMoveResponse);
    }

    this.lastUpdateTime = Date.now();
    this.lastUnitVector = unitVec;
  }
}

export default Hatchery;
