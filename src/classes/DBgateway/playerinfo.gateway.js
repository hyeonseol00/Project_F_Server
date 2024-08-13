import { redisCli } from '../../init/redis/redis.js';

const playerInfoKey = 'playerInfo:';

// =======getter, setter 메소드 시작=========

// playerInfo
export const getPlayerInfo = async (socket) => {
  const playerInfo = JSON.parse(await redisCli.hGetAll(`${playerInfoKey}${socket.remotePort}`));
  return playerInfo;
};

export const setPlayerInfo = async (socket, playerInfo) => {
  for (const field in playerInfo) {
    if (playerInfo.hasOwnProperty(field)) {
      await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, field, playerInfo[field]);
    }
  }
};

// gold
export const getGold = async (socket) => {
  const userGold = await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'gold');
  return userGold;
};

export const setGold = async (socket, updatedGold) => {
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'gold', updatedGold);
};

// statinfo
export const getStatInfo = async (socket) => {
  const statInfo = JSON.parse(await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'statInfo'));
  return statInfo;
}; 

export const setStatInfo = async (socket, statInfo) => {
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'statInfo', statInfo);
};

// inven
export const getInven = async (socket) => {
  const inventory = JSON.parse(await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'inven'));
  return inventory;
};

export const setInven = async (socket, updatedInven) => {
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'inven', updatedInven);
};

// equipment
export const getEquipment = async (socket) => {
  const inventory = JSON.parse(await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'equipment'));
  return inventory;
};

export const setEquipment = async (socket, updatedEquipment) => {
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'equipment', updatedEquipment);
};

// level
export const getLevel = async (socket) => {
  const statInfo = await getStatInfo(socket);
  return statInfo.level;
};

export const setLevel = async (socket, level, experience) => {
  const statInfo = await getStatInfo(socket);
  statInfo.level = level;
  statInfo.exp = experience;
  await setStatInfo(statInfo);
};

// How...?
export const skillPointUpdate = async (socket, statInfo) => {
  await setStatInfo(socket, statInfo);
  // this.skillPoint = statInfo.skillPoint;
};

// =======getter, setter 메소드 끝=========

// ==============item=============

export const getPotionsAccount = async (socket) => {
  const items = await getInven(socket);
  let count = 0;
  for (const item of items) {
    if (item.isPotion === false) continue;
    count += item.quantity;
  }
  return count;
};

export const getItemIdx = async (socket, itemId) => {
  const inventory = await getInven(socket);
  for (const itemIdx in inventory) {
    if (this.items[itemIdx].itemId === itemId) {
      return itemIdx;
    }
  }
  return -1;
};

export const getItem = async (socket, itemId) => {
  const items = await getInven(socket);
  const findItem = items.find((item) => item.itemId === itemId);

  return findItem;
};

export const pushItem = async (socket, item) => {
  const items = await getInven(socket);
  items.push(item);
};

export const deleteItem = async (socket, itemId) => {
  const items = await getInven(socket);
  const findIdx = items.findIndex((item) => item.itemId === itemId);
  if (findIdx !== -1) {
    this.items.splice(findIdx, 1);
  }
};

export const decItem = async (socket, itemId, quantity) => {
  const items = await getInven(socket);
  const findIdx = items.findIndex((item) => item.itemId === itemId);
  this.items[findIdx].quantity -= quantity;
};

export const addItem = async (socket, itemId, quantity) => {
  const items = await getInven(socket);
  const findIdx = items.findIndex((item) => item.itemId === itemId);
  this.items[findIdx].quantity += quantity;
};

export const setItemId = async (socket, itemType, itemId) => {
  const equipment = await getEquipment(socket);
  equipment[itemType] = itemId;
};

export const getItemQuantity = async (socket, itemId) => {
  const items = await getInven(socket);
  const findItem = items.find((item) => item.itemId === itemId);
  if (findItem) {
    return findItem.quantity;
  }
  return 0;
};

export const getPotionItems = async (socket) => {
  const items = await getInven(socket);
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
export const getTeam = async (socket, teamId, isOwner = null) => {
  const teamId = await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'teamId');
  const isOwner = await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'isOwner');

  return { teamId, isOwner };
};

export const setTeam = async (socket, teamId, isOwner = null) => {
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'teamId', teamId);
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'isOwner', isOwner);
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
