export const setPlayerInfo = (playerInfo) => {
  this.playerInfo = playerInfo;
};

export const setTransformInfo = (transform) => {
  this.playerInfo.transform = transform;
};

export const getPlayerInfo = () => {
  return { ...this.playerInfo };
};

export const setPosition = (transform) => {
  this.playerInfo.transform = transform;
  this.lastUpdateTime = Date.now();
};

export const setTeam = (teamId, isOwner = null) => {
  this.teamId = teamId;
  this.isOwner = isOwner;
};

export const setLevel = (level, experience) => {
  this.playerInfo.statInfo.level = level;
  this.playerInfo.statInfo.exp = experience;
};

export const getPotionsAccount = () => {
  let count = 0;
  for (const item of this.items) {
    if (item.isPotion === false) continue;
    count += item.quantity;
  }
  return count;
};

export const getItemIdx = (itemId) => {
  for (const itemIdx in this.items) {
    if (this.items[itemIdx].itemId === itemId) {
      return itemIdx;
    }
  }
  return -1;
};

export const getItem = (itemId) => {
  const findItem = this.items.find((item) => item.itemId === itemId);

  return findItem;
};

export const pushItem = (item) => {
  this.items.push(item);
};

export const deleteItem = (itemId) => {
  const findIdx = this.items.findIndex((item) => item.itemId === itemId);
  if (findIdx !== -1) {
    this.items.splice(findIdx, 1);
  }
};

export const decItem = (itemId, quantity) => {
  const findIdx = this.items.findIndex((item) => item.itemId === itemId);
  this.items[findIdx].quantity -= quantity;
};

export const addItem = (itemId, quantity) => {
  const findIdx = this.items.findIndex((item) => item.itemId === itemId);
  this.items[findIdx].quantity += quantity;
};

export const setItemId = (itemType, itemId) => {
  this.equipment[itemType] = itemId;
};

export const setStatInfo = (statInfo) => {
  this.playerInfo.statInfo = statInfo;
};

export const getStatInfo = () => {
  return this.playerInfo.statInfo;
};

export const getItemQuantity = (itemId) => {
  const findItem = this.items.find((item) => item.itemId === itemId);
  if (findItem) {
    return findItem.quantity;
  }
  return 0;
};

export const setGold = (itemCost) => {
  this.gold = itemCost;
};

export const skillPointUpdate = (statInfo) => {
  this.playerInfo.statInfo = statInfo;
  this.skillPoint = statInfo.skillPoint;
};

export const getPotionItems = () => {
  const potions = [];
  for (const item of this.items) {
    if (item.isPotion) {
      potions.push(item);
    }
  }
  potions.sort((a, b) => a.itemId - b.itemId);
  return potions;
};
