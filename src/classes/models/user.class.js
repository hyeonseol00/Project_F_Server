class User {
  constructor(playerId, nickname, characterClass, socket, effect, items, character) {
    // session management field(user:[socket.remotePort])
    // 통째로 불러와도 괜찮은 정도
    this.playerId = playerId;
    this.characterId = character.characterId;
    this.nickname = nickname;

    // this.characterClass = characterClass;
    // this.characterId = character.characterId || 0;
    this.socket = socket;
    // this.lastUpdateTime = Date.now();
    this.lastLoginTime = Date.now();
    this.state = 'connect';
    this.zoneId = 'town';

    // this.playerId = playerId;
    // this.nickname = nickname;
    // this.characterClass = characterClass;
    // this.items = items;
    // this.gold = character.gold;
    // this.equipment = {
    //   weapon: character.weapon,
    //   armor: character.armor,
    //   gloves: character.gloves,
    //   shoes: character.shoes,
    //   accessory: character.accessory,
    // };

    // players's game data(playerInfo:[socket.remotePort])
    this.playerInfo = {};
    // const playerInfo = {
    //   playerId: curUser.playerId, // not neccessary
    //   nickname,
    //   class: characterClass,
    //   gold: curUser.gold,
    //   transform: transformInfo,  // not neccessary
    //   statInfo,
    //   inven,
    //   equipment,
    // };

    // 공격 이펙트 코드 // not neccessary... but packet is defined
    this.effectCode = {
      normal: effect.baseEffect,
      single: effect.singleEffect,
      wide: effect.wideEffect,
    };
    this.quests = [];
  }
}

export default User;
