class User {
  constructor(
    playerId,
    nickname,
    characterClass,
    characterId,
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
    worldLevel,
    weapon,
    armor,
    gloves,
    shoes,
    accessory,
  ) {
    this.playerId = playerId;
    this.nickname = nickname;
    this.characterClass = characterClass;
    this.characterId = characterId;
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
    this.worldLevel = worldLevel;
    this.weapon = weapon;
    this.armor = armor;
    this.gloves = gloves;
    this.shoes = shoes;
    this.accessory = accessory;

    this.effectCode = { normal: normalCode, single: singleSkillCode, wide: wideSkillCode };
  }

  setPlayerInfo(playerInfo) {
    this.playerInfo = playerInfo;
  }

  getPlayerInfo() {
    return { ...this.playerInfo };
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
    this.playerInfo.statInfo.level = level;
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

  getItemIdx2(itemId) {
    for (const itemIdx in this.mountingItems) {
      if (this.mountingItems[itemIdx].itemId === itemId) {
        return itemIdx;
      }
    }
    return -1;
  }

  findItemByInven(itemId) {
    const findItem = this.mountingItems.find((item) => item.itemId === itemId);

    return findItem;
  }

  updateCriAvoid(critical, avoidAbility) {
    this.critical = critical;
    this.avoidAbility = avoidAbility;
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
        this.weapon = itemId;
        break;
      case 'armor':
        this.armor = itemId;
        break;
      case 'gloves':
        this.gloves = itemId;
        break;
      case 'shoes':
        this.shoes = itemId;
        break;
      case 'accessory':
        this.accessory = itemId;
        break;
      default:
        break;
    }
  }

  updateStatInfo(statInfo) {
    this.playerInfo.statInfo = statInfo;
  }

  getItemQuantity(itemId) {
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
}

export default User;
