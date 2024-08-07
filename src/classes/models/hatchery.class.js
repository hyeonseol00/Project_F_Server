import { config } from '../../config/config.js';
import { findMonsterById } from '../../db/game/game.db.js';
import { createResponse } from '../../utils/response/createResponse.js';
import toEulerAngles from '../../utils/toEulerAngle.js';
import IntervalManager from '../managers/interval.manager.js';
import BossMonster from './bossMonster.class.js';

class Hatchery {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.players = [];
    this.intervalManager = new IntervalManager();
    this.lastUnitVector = { x: 0, z: 0 };

    this.initMonster({ ...config.hatchery.bossInitTransform });
  }

  async initMonster(transform) {
    const monster = await findMonsterById(config.hatchery.bossId);
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
      this.initialize();
    }
  }

  bossMove() {
    if (this.players.length <= 0 || this.boss.hp <= 0) {
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

    const moveDistance = timeDiff * speed;
    let distanceX = lastUnitVec.x * moveDistance;
    let distanceZ = lastUnitVec.z * moveDistance;
    bossTr.posX += distanceX;
    bossTr.posZ += distanceZ;
    // Math.sqrt(distanceX * distanceX + distanceZ * distanceZ) 클라에서 이동한 거리
    const bossDistanceToPlayer = this.boss.getDistanceFromPlayer(targetPlayerTr);
    const bossAttackRange = config.hatchery.bossAttackRange;
    let inRange = false;
    if (bossDistanceToPlayer < bossAttackRange) {
      // bossAttackRange에 들어오면 플레이어 공격
      // 현재는 위치만 그대로 보내주기
      bossTr.posX -= distanceX;
      bossTr.posZ -= distanceZ;
      // 이동했던 위치 원상복구

      // 이동 전 거리가 10 이상일 때만 10까지는 이동시켜주는거
      if (minDistance > bossAttackRange) {
        const remainingDistance = minDistance - bossAttackRange;
        const scalingFactor = remainingDistance / moveDistance;
        distanceX *= scalingFactor;
        distanceZ *= scalingFactor;
        // 거리 10 이상이게 비율 조정해서 이동거리 보내주기
        bossTr.posX += distanceX;
        bossTr.posZ += distanceZ;

        // 이러면 거리 10!
      }
      inRange = true;
    }

    // 타겟 플레이어에 대한 몬스터의 방향 벡터 계산
    const unitVec = this.boss.getUnitVectorFromPlayer(targetPlayerTr);
    const rot = toEulerAngles(unitVec);
    bossTr.rot = rot - 90;

    const bossUnitVector = inRange
      ? { unitX: 0, unitZ: 0 }
      : { unitX: unitVec.x, unitZ: unitVec.z };

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
