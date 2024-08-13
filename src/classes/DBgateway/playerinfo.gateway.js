import { redisCli } from '../../init/redis/redis.js';

const playerInfoKey = 'playerInfo:';

// =======getter, setter 메소드 시작=========

// playerInfo
export const getPlayerInfo = async (socket) => {
  const playerInfo = await redisCli.hGetAll(`${playerInfoKey}${socket.remotePort}`);

  for (const key in playerInfo) {
    playerInfo[key] = JSON.parse(playerInfo[key]);
  }

  return playerInfo;
};

export const setPlayerInfo = async (socket, playerInfo) => {
  for (const field in playerInfo) {
    await redisCli.hSet(
      `${playerInfoKey}${socket.remotePort}`,
      field,
      JSON.stringify(playerInfo[field]),
    );
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
  const statInfo = JSON.parse(
    await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'statInfo'),
  );
  return statInfo;
};

export const setStatInfo = async (socket, statInfo) => {
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'statInfo', JSON.stringify(statInfo));
};

// inven
export const getInven = async (socket) => {
  const { items } = JSON.parse(
    await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'inven'),
  );
  return items;
};

export const setInven = async (socket, updatedInven) => {
  const inven = {};
  inven.items = [...updatedInven];
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'inven', JSON.stringify(inven));
};

// equipment
export const getEquipment = async (socket) => {
  const inventory = JSON.parse(
    await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'equipment'),
  );
  return inventory;
};

export const setEquipment = async (socket, updatedEquipment) => {
  await redisCli.hSet(
    `${playerInfoKey}${socket.remotePort}`,
    'equipment',
    JSON.stringify(updatedEquipment),
  );
};

// level
export const getLevel = async (socket) => {
  const statInfo = await getStatInfo(socket);
  return statInfo.level;
};

export const setLevel = async (socket, statInfo, gold, skillPoint) => {
  await setStatInfo(socket, statInfo);
  await setGold(socket, gold);
};

// How...?
export const skillPointUpdate = async (socket, skillPoint) => {
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'skillPoint', skillPoint);
  // await setStatInfo(socket, statInfo);
  // this.skillPoint = statInfo.skillPoint;
};

export const setWorldLevel = async (socket, worldLevel) => {
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'worldLevel', worldLevel);
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

export const getItemIdx = async (socket, id) => {
  const inventory = await getInven(socket);
  for (const itemIdx in inventory) {
    if (inventory[itemIdx].id === id) {
      return itemIdx;
    }
  }
  return -1;
};

export const getItem = async (socket, id) => {
  const items = await getInven(socket);
  const findItem = items.find((item) => item.id === id);

  return findItem;
};

export const pushItem = async (socket, item) => {
  const items = await getInven(socket);
  items.push(item);
  await setInven(socket, items);
};

export const deleteItem = async (socket, id) => {
  const items = await getInven(socket);
  const findIdx = items.findIndex((item) => item.id === id);
  if (findIdx !== -1) {
    items.splice(findIdx, 1);
    await setInven(socket, items);
  }
};

export const decItem = async (socket, id, quantity) => {
  const items = await getInven(socket);
  const findIdx = items.findIndex((item) => item.id === id);
  items[findIdx].quantity -= quantity;
  await setInven(socket, items);
};

export const addItem = async (socket, id, quantity) => {
  const items = await getInven(socket);
  const findIdx = items.findIndex((item) => item.id === id);
  items[findIdx].quantity += quantity;
  await setInven(socket, items);
};

export const setItemId = async (socket, itemType, id) => {
  const equipment = await getEquipment(socket);
  equipment[itemType] = id;
  await setEquipment(socket, equipment);
};

export const getItemQuantity = async (socket, id) => {
  const items = await getInven(socket);
  const findItem = items.find((item) => item.id === id);
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
  potions.sort((a, b) => a.id - b.id);
  return potions;
};
// ==============item=============

// ==========team==========
export const getTeam = async (socket) => {
  const teamId = await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'teamId');
  const isOwner = await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'isOwner');

  return { teamId, isOwner };
};

export const setTeam = async (socket, teamId, isOwner = null) => {
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'teamId', teamId);
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'isOwner', isOwner);
};

export const getInvitedTeams = async (socket) => {
  const invitedTeams = await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'invitedTeams');
  return invitedTeams;
};

export const setInvitedTeams = async (socket, updatedInvitedTeams) => {
  await redisCli.hSet(
    `${playerInfoKey}${socket.remotePort}`,
    'invitedTeams',
    JSON.stringify(updatedInvitedTeams),
  );
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
