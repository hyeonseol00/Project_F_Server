import { getDungeonItemsByDungeonCode, getItemById } from '../../assets/item.assets.js';
import { config } from '../../config/config.js';
import { findMonsterById } from '../../db/game/game.db.js';
import { gameQueueProcess } from '../../handlers/hatchery/attackBoss.handler.js';
import { getUserByNickname } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';
import toEulerAngles from '../../utils/toEulerAngle.js';
import { getStatInfo } from '../DBgateway/playerinfo.gateway.js';
import IntervalManager from '../managers/interval.manager.js';
import BossMonster from './bossMonster.class.js';
import Bull from 'bull';
import { getMonsterById } from '../../assets/monster.assets.js';
import Item from './item.class.js';

class Hatchery {
  constructor() {
    this.nextBossId = config.hatchery.bossId;
    this.initialize();
  }

  async initialize() {
    this.berserkerList = [];
    this.invincibilityList = [];
    this.phase = 1;
    this.gameQueue = new Bull(config.bullQueue.queueName, {
      redis: {
        host: config.redis.host,
        port: config.redis.port,
        username: config.redis.username,
        password: config.redis.password,
      },
    });

    this.gameQueue.process(async (queue) => {
      await gameQueueProcess(JSON.parse(queue.data.nickname));
      done();
    });

    this.playerNicknames = [];
    this.intervalManager = new IntervalManager();
    this.lastUnitVector = { x: 0, z: 0 };
    this.lastAttackTime = Date.now();
    this.transforms = {};
    /* this.transforms = {
      nickname: { posX: 0, posY: 0, posZ: 0, rot: 0 },
      nickname2: { posX: 0, posY: 0, posZ: 0, rot: 0 },
    }; */

    // 보스 생성
    this.createMonster({ ...config.hatchery.bossInitTransform });

    this.pushDungeonItems(config.hatchery.dungeonCode);
  }

  async addGameQueue(data) {
    await this.gameQueue.add({ nickname: JSON.stringify(data) });
  }

  async createMonster(transform) {
    const bossId = this.nextBossId;
    this.nextBossId = config.hatchery.bossId;
    const monster = await getMonsterById(bossId);
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

  addPlayer(playerNickname) {
    if (this.playerNicknames.length >= config.hatchery.maxPlayers) {
      return `[Notice] 이미 4명의 플레이어가 공략 중입니다!\n[Notice] 공략 중인 플레이어: ${this.playerNicknames[0]}님, ${this.playerNicknames[1]}님, ${this.playerNicknames[2]}님, ${this.playerNicknames[3]}님`;
    } else if (this.phase > 1) {
      return `[Notice] 게임이 2페이즈 이상 진행되었습니다!\n[Notice] 현재 페이즈: ${this.phase}`;
    } else if (this.playerNicknames.length <= 0) {
      this.intervalManager.addPlayer(
        config.hatchery.bossTargetIntervalId,
        () => this.bossMove(),
        config.hatchery.bossTargetInterval,
        'monster',
      );
      this.lastUpdateTime = Date.now();
    }
    this.playerNicknames.push(playerNickname);
    return false;
  }

  removePlayer(nickname) {
    this.playerNicknames = this.playerNicknames.filter(
      (playerNickname) => playerNickname !== nickname,
    );

    if (this.playerNicknames.length <= 0) {
      this.intervalManager.removePlayer(config.hatchery.bossTargetIntervalId);
      this.initialize();
    }
  }

  async bossMove() {
    if (this.playerNicknames.length <= 0 || this.boss.hp <= 0) {
      return;
    }

    const players = [];
    for (let i = 0; i < this.playerNicknames.length; i++) {
      players.push(getUserByNickname(this.playerNicknames[i]));
    }

    const bossTr = this.boss.transform;
    const firstTr = players[0].transform;
    let targetPlayerTr = firstTr;
    let minDistance = 2e9;

    // 플레이어들과 몬스터 간의 거리 계산
    for (const player of players) {
      const playerTr = this.transforms[player.nickname];
      const distance = this.boss.getDistanceFromPlayer(playerTr);
      const playerStatInfo = await getStatInfo(player.socket);
      const hp = playerStatInfo.hp;
      if (minDistance > distance && hp > 0) {
        minDistance = distance;
        targetPlayerTr = playerTr;
      }
    }

    if (minDistance === 2e9) {
      return;
    }

    // 여기 부분에 현재 위치 계산
    const lastUnitVec = this.lastUnitVector;
    const elapsedTime = Date.now() - this.lastUpdateTime;
    const elapsedAttackTime = Date.now() - this.lastAttackTime;
    const timeDiff = elapsedTime / 1000;
    const speed = elapsedAttackTime > config.hatchery.bossAttackDelay ? this.boss.speed : 0;

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

    const bossUnitVector =
      inRange || !speed ? { unitX: 0, unitZ: 0 } : { unitX: unitVec.x, unitZ: unitVec.z };

    const bossMoveResponse = createResponse('response', 'S_BossMove', {
      bossTransform: bossTr,
      bossUnitVector,
    });

    for (const player of players) {
      player.socket.write(bossMoveResponse);
    }

    if (inRange && elapsedAttackTime > config.hatchery.bossAttackSpeed) {
      const bossAttackResponse = createResponse('response', 'S_BossTryAttack', {});
      for (const player of players) {
        player.socket.write(bossAttackResponse);
      }
      this.lastAttackTime = Date.now();
    }

    this.lastUpdateTime = Date.now();
    this.lastUnitVector = unitVec;
  }

  async pushDungeonItems(dungeonCode) {
    this.items = [];
    this.randomItems = []; // random item idx list

    const dungeonItems = await getDungeonItemsByDungeonCode(dungeonCode + 5000);
    for (const item of dungeonItems) {
      const curItem = new Item(item.id);
      for (let i = 0; i < item.itemProbability; i++) {
        // 확률 90 = 90개, 9 = 9개, 1 = 1개 넣어줌
        this.randomItems.push(this.items.length); // items에 저장될 idx
      }
      this.items.push(curItem);
    }
  }

  getRandomItem() {
    return this.items[this.randomItems[Math.floor(Math.random() * this.randomItems.length)]];
  }

  berserkerModeOn(nickname) {
    this.berserkerList.push(nickname);
    console.log('berserkerList: ', this.berserkerList);
  }

  berserkerModeOff(nickname) {
    this.berserkerList = this.berserkerList.filter((name) => name !== nickname);
    console.log('berserkerList: ', this.berserkerList);
  }

  invincibilityModeOn(nickname) {
    this.invincibilityList.push(nickname);
    console.log('invincibilityList: ', this.invincibilityList);
  }

  invincibilityModeOff(nickname) {
    this.invincibilityList = this.invincibilityList.filter((name) => name !== nickname);
    console.log('invincibilityList: ', this.invincibilityList);
  }
}

export default Hatchery;
