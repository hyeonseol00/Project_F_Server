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
    this.state = "connect"
    this.zoneId = "town"
    
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

<<<<<<< HEAD
=======
  setPlayerInfo(playerInfo) {
    this.playerInfo = playerInfo;
  }

  setTransformInfo(transform) {
    this.playerInfo.transform = transform;
  }

  getPlayerInfo() {
    return { ...this.playerInfo };
  }

  setPosition(transform) {
    this.playerInfo.transform = transform;
    this.lastUpdateTime = Date.now();
  }

  setTeam(teamId, isOwner = null) {
    this.teamId = teamId;
    this.isOwner = isOwner;
  }

  setLevel(level, experience) {
    this.playerInfo.statInfo.level = level;
    this.playerInfo.statInfo.exp = experience;
  }

  getPotionsAccount() {
    let count = 0;
    for (const item of this.items) {
      if (item.isPotion === false) continue;
      count += item.quantity;
    }
    return count;
  }

  getItemIdx(itemId) {
    for (const itemIdx in this.items) {
      if (this.items[itemIdx].itemId === itemId) {
        return itemIdx;
      }
    }
    return -1;
  }

  getItem(itemId) {
    const findItem = this.items.find((item) => item.itemId === itemId);

    return findItem;
  }

  pushItem(item) {
    this.items.push(item);
  }

  deleteItem(itemId) {
    const findIdx = this.items.findIndex((item) => item.itemId === itemId);
    if (findIdx !== -1) {
      this.items.splice(findIdx, 1);
    }
  }

  decItem(itemId, quantity) {
    const findIdx = this.items.findIndex((item) => item.itemId === itemId);
    this.items[findIdx].quantity -= quantity;
  }

  addItem(itemId, quantity) {
    const findIdx = this.items.findIndex((item) => item.itemId === itemId);
    this.items[findIdx].quantity += quantity;
  }

  setItemId(itemType, itemId) {
    this.equipment[itemType] = itemId;
  }

  setStatInfo(statInfo) {
    this.playerInfo.statInfo = statInfo;
  }

  getItemQuantity(itemId) {
    const findItem = this.items.find((item) => item.itemId === itemId);
    if (findItem) {
      return findItem.quantity;
    }
    return 0;
  }

  setGold(itemCost) {
    this.gold = itemCost;
  }

  skillPointUpdate(statInfo) {
    this.playerInfo.statInfo = statInfo;
    this.skillPoint = statInfo.skillPoint;
  }

  getPotionItems() {
    const potions = [];
    for (const item of this.items) {
      if (item.isPotion) {
        potions.push(item);
      }
    }
    potions.sort((a, b) => a.itemId - b.itemId);
    return potions;
  }
>>>>>>> 23207a6c188135843fa1ead0ed63ebcb617043a4
}

export default User;
