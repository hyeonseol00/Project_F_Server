class User {
  constructor(
    playerId,
    nickname,
    characterClass,
    socket,
    experience,
    normalCode,
    singleSkillCode,
    wideSkillCode,
    items,
    critical,
    criticalAttack,
    avoidAbility,
    gold,
    worldLevel,
  ) {
    this.playerId = playerId;
    this.nickname = nickname;
    this.characterClass = characterClass;
    this.socket = socket;
    this.experience = experience;
    this.lastUpdateTime = Date.now();
    this.playerInfo = {};
    this.items = items;
    this.experience = experience;
    this.critical = critical;
    this.criticalAttack = criticalAttack;
    this.avoidAbility = avoidAbility;
    this.gold = gold;
    this.worldLevel = worldLevel;

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

  setTeam(isOwner, teamId) {
    this.isOwner = isOwner;
    this.teamId = teamId;
  }

  updateLevel(level, experience) {
    this.level = level;
    this.experience = experience;
  }

  getItemIdx(name) {
    for (const itemIdx in this.items) {
      if (this.items[itemIdx].name === name) {
        return itemIdx;
      }
    }
    return -1;
  }

  getItemsAccount() {
    let count = 0;
    for (const item of this.items) {
      count += item.quantity;
    }
    return count;
  }
}

export default User;
