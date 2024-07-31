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
    potions,
    mountingItems,
    critical,
    criticalAttack,
    avoidAbility,
    gold,
  ) {
    this.playerId = playerId;
    this.nickname = nickname;
    this.characterClass = characterClass;
    this.socket = socket;
    this.experience = experience;
    this.lastUpdateTime = Date.now();
    this.playerInfo = {};
    this.potions = potions;
    this.mountingItems = mountingItems;
    this.experience = experience;
    this.critical = critical;
    this.criticalAttack = criticalAttack;
    this.avoidAbility = avoidAbility;
    this.gold = gold;

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

  getPotionIdx(name) {
    for (const potionIdx in this.potions) {
      if (this.potions[potionIdx].name === name) {
        return potionIdx;
      }
    }
    return -1;
  }

  getPotionsAccount() {
    let count = 0;
    for (const potion of this.potions) {
      count += potion.quantity;
    }
    return count;
  }

  getItemIdx(name) {
    for (const itemIdx in this.mountingItems) {
      if (this.mountingItems[itemIdx].name === name) {
        return itemIdx;
      }
    }
    return -1;
  }
}

export default User;
