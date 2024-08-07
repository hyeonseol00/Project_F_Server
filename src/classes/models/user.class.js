class User {
  constructor(
    playerId,
    nickname,
    characterClass,
    socket,
    effect,
    potions,
    mountingItems,
    character,
  ) {
    this.playerId = playerId;
    this.nickname = nickname;
    this.characterClass = characterClass;
    this.characterId = character.characterId;
    this.socket = socket;
    this.lastUpdateTime = Date.now();
    this.playerInfo = {};
    this.potions = potions;
    this.mountingItems = mountingItems;
    this.gold = character.gold;
    this.worldLevel = character.worldLevel;
    this.skillPoint = character.skillPoint;
    this.equipment = {
      weapon: character.weapon,
      armor: character.armor,
      gloves: character.gloves,
      shoes: character.shoes,
      accessory: character.accessory,
    };

    this.effectCode = {
      normal: effect.baseEffect,
      single: effect.singleEffect,
      wide: effect.wideEffect,
    };
  }

  setPlayerInfo(playerInfo) {
    this.playerInfo = playerInfo;
  }

  setTransformInfo(transform) {
    this.playerInfo.transform = transform;
  }

  getPlayerInfo() {
    return { ...this.playerInfo };
  }

  updatePosition(transform) {
    this.playerInfo.transform = transform;
    this.lastUpdateTime = Date.now();
  }

  setTeam(isOwner, teamId) {
    this.isOwner = isOwner;
    this.teamId = teamId;
  }

  updateLevel(level, experience) {
    this.playerInfo.statInfo.level = level;
    this.playerInfo.statInfo.exp = experience;
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

  getMountingItemIdx(name) {
    for (const itemIdx in this.mountingItems) {
      if (this.mountingItems[itemIdx].name === name) {
        return itemIdx;
      }
    }
    return -1;
  }

  findMountingItemByInven(itemId) {
    const findItem = this.mountingItems.find((item) => item.itemId === itemId);

    return findItem;
  }

  updateCriAvoid(critical, avoidAbility) {
    this.playerInfo.statInfo.critRate = critical;
    this.playerInfo.statInfo.avoidRate = avoidAbility;
  }

  pushMountingItem(item) {
    this.mountingItems.push(item);
  }

  pushPotionItem(item) {
    this.potions.push(item);
  }

  deleteMountingItem(itemId) {
    const findIdx = this.mountingItems.findIndex((item) => item.itemId === itemId);
    if (findIdx !== -1) {
      this.mountingItems.splice(findIdx, 1);
    }
  }

  decMountingItem(itemId, quantity) {
    const findIdx = this.mountingItems.findIndex((item) => item.itemId === itemId);
    this.mountingItems[findIdx].quantity -= quantity;
  }

  addMountingItem(itemId, quantity) {
    const findIdx = this.mountingItems.findIndex((item) => item.itemId === itemId);
    this.mountingItems[findIdx].quantity += quantity;
  }

  updateItemId(itemType, itemId) {
    switch (itemType) {
      case 'weapon':
        this.equipment.weapon = itemId;
        break;
      case 'armor':
        this.equipment.armor = itemId;
        break;
      case 'gloves':
        this.equipment.gloves = itemId;
        break;
      case 'shoes':
        this.equipment.shoes = itemId;
        break;
      case 'accessory':
        this.equipment.accessory = itemId;
        break;
      default:
        break;
    }
  }

  updateStatInfo(statInfo) {
    this.playerInfo.statInfo = statInfo;
  }

  getMountingItemQuantity(itemId) {
    const findItem = this.mountingItems.find((item) => item.itemId === itemId);
    if (findItem) {
      return findItem.quantity;
    }
    return 0;
  }

  plusGold(itemCost) {
    this.gold += itemCost;
  }

  minusGold(itemCost) {
    this.gold -= itemCost;
  }

  addPotion(itemId, quantity) {
    const findIdx = this.potions.findIndex((item) => item.itemId === itemId);
    this.potions[findIdx].quantity += quantity;
  }

  decPotion(itemId, quantity) {
    const findIdx = this.potions.findIndex((item) => item.itemId === itemId);
    this.potions[findIdx].quantity -= quantity;
  }

  getPotionItemQuantity(itemId) {
    const findItem = this.potions.find((item) => item.itemId === itemId);
    if (findItem) {
      return findItem.quantity;
    }
    return 0;
  }

  deletePotionItem(itemId) {
    const findIdx = this.potions.findIndex((item) => item.itemId === itemId);
    if (findIdx !== -1) {
      this.potions.splice(findIdx, 1);
    }
  }

  skillPointUpdate(statInfo) {
    this.playerInfo.statInfo = statInfo;
    this.skillPoint = statInfo.skillPoint;
  }
}

export default User;
