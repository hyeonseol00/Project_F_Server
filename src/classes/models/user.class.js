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
  ) {
    this.playerId = playerId;
    this.nickname = nickname;
    this.characterClass = characterClass;
    this.socket = socket;
    this.experience = experience;
    this.lastUpdateTime = Date.now();
    this.playerInfo = {};
    this.items = items;

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
}

export default User;
