import { config } from '../../config/config.js';

class User {
  constructor(
    playerId,
    nickname,
    characterClass,
    socket,
    hp,
    mp,
    attack,
    defense,
    magic,
    speed,
    level,
    experience,
    normalCode,
    singleSkillCode,
    wideSkillCode,
  ) {
    this.playerId = playerId;
    this.nickname = nickname;
    this.characterClass = characterClass;
    this.socket = socket;
    this.lastUpdateTime = Date.now();
    this.playerInfo = {};
    this.battleSceneStatus = config.sceneStatus.message;

    this.hp = hp;
    this.mp = mp;
    this.attack = attack;
    this.defense = defense;
    this.magic = magic;
    this.speed = speed;
    this.level = level;
    this.experience = experience;

    this.effectCode = { normal: normalCode, single: singleSkillCode, wide: wideSkillCode };
  }

  setPlayerInfo(playerInfo) {
    this.playerInfo = playerInfo;
  }

  updatePosition(x, y, z, rot) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.rot = rot;
    this.lastUpdateTime = Date.now();
  }

  updateLevel(level, experience) {
    this.level = level;
    this.experience = experience;
  }
}

export default User;
