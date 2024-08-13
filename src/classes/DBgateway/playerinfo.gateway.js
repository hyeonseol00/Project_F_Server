import { redisCli } from '../../init/redis/redis.js';

const playerInfoKey = 'playerInfo:';

// =======getter, setter 메소드 시작=========

// playerInfo
export const getPlayerInfo = (socket) => {
  const playerInfo = JSON.parse(redisCli.hGetAll(`${playerInfoKey}${socket.remotePort}`));
  return playerInfo;
};

export const setPlayerInfo = (socket, playerInfo) => {
  for (const field in playerInfo) {
    if (playerInfo.hasOwnProperty(field)) {
      redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, field, playerInfo[field]);
    }
  }

  redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, playerInfo);
};

// gold
export const getGold = (socket) => {
  const userGold = redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'gold');
  return userGold;
};

export const setGold = (socket, updatedGold) => {
  redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'gold', updatedGold);
};

// statinfo
export const getStatInfo = (socket) => {
  const statInfo = JSON.parse(redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'statInfo'));
  return statInfo;
};

export const setStatInfo = (socket, statInfo) => {
  redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'statInfo', statInfo);
};

// inven
export const getInven = (socket) => {
  const inventory = JSON.parse(redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'inven'));
  return inventory;
};

export const setInven = (socket, updatedInven) => {
  redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'inven', updatedInven);
};

// equipment
export const getEquipment = (socket) => {
  const inventory = JSON.parse(redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'equipment'));
  return inventory;
};

export const setEquipment = (socket, updatedEquipment) => {
  redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'equipment', updatedEquipment);
};

// level
export const getLevel = (socket) => {
  const statInfo = getStatInfo(socket);
  return statInfo.level;
};

export const setLevel = (socket, level, experience) => {
  const statInfo = getStatInfo(socket);
  statInfo.level = level;
  statInfo.exp = experience;
  setStatInfo(statInfo);
};

// How...?
export const skillPointUpdate = (socket, statInfo) => {
  setStatInfo(socket, statInfo);
  // this.skillPoint = statInfo.skillPoint;
};

// =======getter, setter 메소드 끝=========

// ==============item=============

export const getPotionsAccount = (socket) => {
  const items = getInven(socket);
  let count = 0;
  for (const item of items) {
    if (item.isPotion === false) continue;
    count += item.quantity;
  }
  return count;
};

export const getItemIdx = (socket, itemId) => {
  const inventory = getInven(socket);
  for (const itemIdx in inventory) {
    if (this.items[itemIdx].itemId === itemId) {
      return itemIdx;
    }
  }
  return -1;
};

export const getItem = (socket, itemId) => {
  const items = getInven(socket);
  const findItem = items.find((item) => item.itemId === itemId);

  return findItem;
};

export const pushItem = (socket, item) => {
  const items = getInven(socket);
  items.push(item);
};

export const deleteItem = (socket, itemId) => {
  const items = getInven(socket);
  const findIdx = items.findIndex((item) => item.itemId === itemId);
  if (findIdx !== -1) {
    this.items.splice(findIdx, 1);
  }
};

export const decItem = (socket, itemId, quantity) => {
  const items = getInven(socket);
  const findIdx = items.findIndex((item) => item.itemId === itemId);
  this.items[findIdx].quantity -= quantity;
};

export const addItem = (socket, itemId, quantity) => {
  const items = getInven(socket);
  const findIdx = items.findIndex((item) => item.itemId === itemId);
  this.items[findIdx].quantity += quantity;
};

export const setItemId = (socket, itemType, itemId) => {
  const equipment = getEquipment(socket);
  equipment[itemType] = itemId;
};

export const getItemQuantity = (socket, itemId) => {
  const items = getInven(socket);
  const findItem = items.find((item) => item.itemId === itemId);
  if (findItem) {
    return findItem.quantity;
  }
  return 0;
};

export const getPotionItems = (socket) => {
  const items = getInven(socket);
  const potions = [];
  for (const item of items) {
    if (item.isPotion) {
      potions.push(item);
    }
  }
  potions.sort((a, b) => a.itemId - b.itemId);
  return potions;
};
// ==============item=============

// ==========team==========
export const getTeam = (socket, teamId, isOwner = null) => {
  const teamId = redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'teamId');
  const isOwner = redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'isOwner');

  return { teamId, isOwner };
};

export const setTeam = (socket, teamId, isOwner = null) => {
  redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'teamId', teamId);
  redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'isOwner', isOwner);
};

// 쓰레기 통

// DB에서 관리 안 함
// export const setTransformInfo = (transform) => {
//   this.playerInfo.transform = transform;
// };

// export const setPosition = (transform) => {
//   this.playerInfo.transform = transform;
//   this.lastUpdateTime = Date.now();
// };
