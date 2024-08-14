import { redisCli } from '../../init/redis/redis.js';
import { getUserBySocket } from '../../session/user.session.js';

const playerInfoKey = 'playerInfo:';

// =======getter, setter 메소드 시작=========

// playerInfo
export const getPlayerInfo = async (socket) => {
  if (!socket) {
    return null;
  }

  const playerInfo = await redisCli.hGetAll(`${playerInfoKey}${socket.remotePort}`);

  for (const key in playerInfo) {
    try {
      playerInfo[key] = JSON.parse(playerInfo[key]);
    } catch (err) {
      console.log(err);
    }
  }

  return playerInfo;
};

export const setPlayerInfo = async (socket, playerInfo) => {
  if (!socket) {
    return null;
  }
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
  if (!socket) {
    return null;
  }
  const userGold = await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'gold');
  return userGold;
};

export const setGold = async (socket, updatedGold) => {
  if (!socket) {
    return null;
  }
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'gold', JSON.stringify(updatedGold));
};

// statinfo
export const getStatInfo = async (socket) => {
  if (!socket) {
    return null;
  }
  const statInfo = JSON.parse(
    await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'statInfo'),
  );
  return statInfo;
};

export const setStatInfo = async (socket, statInfo) => {
  if (!socket) {
    return null;
  }
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'statInfo', JSON.stringify(statInfo));
};

// inven
export const getInven = async (socket) => {
  if (!socket) {
    return null;
  }
  const { items } = JSON.parse(
    await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'inven'),
  );
  return items;
};

export const setInven = async (socket, updatedInven) => {
  if (!socket) {
    return null;
  }
  const inven = {};
  inven.items = [...updatedInven];
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'inven', JSON.stringify(inven));
};

// equipment
export const getEquipment = async (socket) => {
  if (!socket) {
    return null;
  }
  const inventory = JSON.parse(
    await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'equipment'),
  );
  return inventory;
};

export const setEquipment = async (socket, updatedEquipment) => {
  if (!socket) {
    return null;
  }
  await redisCli.hSet(
    `${playerInfoKey}${socket.remotePort}`,
    'equipment',
    JSON.stringify(updatedEquipment),
  );
};

// level
export const getLevel = async (socket) => {
  if (!socket) {
    return null;
  }
  const statInfo = await getStatInfo(socket);
  return statInfo.level;
};

// How...?
export const skillPointUpdate = (socket, skillPoint) => {
  if (!socket) {
    return null;
  }
  const user = getUserBySocket(socket);
  user.skillPoint = skillPoint;
};

export const setWorldLevel = (socket, worldLevel) => {
  if (!socket) {
    return null;
  }
  const user = getUserBySocket(socket);
  user.worldLevel = worldLevel;
};

// =======getter, setter 메소드 끝=========

// ==============item=============

export const getPotionsAccount = async (socket) => {
  if (!socket) {
    return null;
  }
  const items = await getInven(socket);
  let count = 0;
  for (const item of items) {
    if (item.isPotion === false) continue;
    count += item.quantity;
  }
  return count;
};

export const getItemIdx = async (socket, id) => {
  if (!socket) {
    return null;
  }
  const inventory = await getInven(socket);
  for (const itemIdx in inventory) {
    if (inventory[itemIdx].id === id) {
      return itemIdx;
    }
  }
  return -1;
};

export const getItem = async (socket, id) => {
  if (!socket) {
    return null;
  }
  const items = await getInven(socket);
  const findItem = items.find((item) => item.id === id);

  return findItem;
};

export const pushItem = async (socket, item) => {
  if (!socket) {
    return null;
  }
  const items = await getInven(socket);
  items.push(item);
  await setInven(socket, items);
};

export const deleteItem = async (socket, id) => {
  if (!socket) {
    return null;
  }
  const items = await getInven(socket);
  const findIdx = items.findIndex((item) => item.id === id);
  if (findIdx !== -1) {
    items.splice(findIdx, 1);
    await setInven(socket, items);
  }
};

export const decItem = async (socket, id, quantity) => {
  if (!socket) {
    return null;
  }
  const items = await getInven(socket);
  const findIdx = items.findIndex((item) => item.id === id);
  items[findIdx].quantity -= quantity;
  await setInven(socket, items);
};

export const addItem = async (socket, id, quantity) => {
  if (!socket) {
    return null;
  }
  const items = await getInven(socket);
  const findIdx = items.findIndex((item) => item.id === id);
  items[findIdx].quantity += quantity;
  await setInven(socket, items);
};

export const setItemId = async (socket, itemType, id) => {
  if (!socket) {
    return null;
  }
  const equipment = await getEquipment(socket);
  equipment[itemType] = id;
  await setEquipment(socket, equipment);
};

export const getItemQuantity = async (socket, id) => {
  if (!socket) {
    return null;
  }
  const items = await getInven(socket);
  const findItem = items.find((item) => item.id === id);
  if (findItem) {
    return findItem.quantity;
  }
  return 0;
};

export const getPotionItems = async (socket) => {
  if (!socket) {
    return null;
  }
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
  if (!socket) {
    return { teamId: null, isOwner: null };
  }
  const teamId = await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'teamId');
  const isOwner = await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'isOwner');

  return { teamId, isOwner };
};

export const setTeam = async (socket, teamId, isOwner = null) => {
  if (!socket) {
    return null;
  }
  if (teamId) {
    await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'teamId', JSON.stringify(teamId));
  } else {
    await redisCli.hDel(`${playerInfoKey}${socket.remotePort}`, 'teamId');
  }
  await redisCli.hSet(`${playerInfoKey}${socket.remotePort}`, 'isOwner', +isOwner);
};

export const getInvitedTeams = async (socket) => {
  if (!socket) {
    return null;
  }
  const invitedTeams = await redisCli.hGet(`${playerInfoKey}${socket.remotePort}`, 'invitedTeams');
  return JSON.parse(invitedTeams);
};

export const setInvitedTeams = async (socket, updatedInvitedTeams) => {
  if (!socket) {
    return null;
  }
  await redisCli.hSet(
    `${playerInfoKey}${socket.remotePort}`,
    'invitedTeams',
    JSON.stringify(updatedInvitedTeams),
  );
};
