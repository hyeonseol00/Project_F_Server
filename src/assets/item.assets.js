import { getAllItemData, getDungeonItems } from '../db/game/game.db.js';
import { redisCli } from '../init/redis/redis.js';
import { config } from '../config/config.js';

export const loadItemTable = async () => {
  const itemComponent = await getAllItemData();

  itemComponent.forEach(async (item) => {
    await redisCli.hSet(`${config.redisKey.itemTable}`, `${item.id}`, JSON.stringify(item));
  });
};

export const getItemById = async (id) => {
  const itemData = await redisCli.hGet(`${config.redisKey.itemTable}`, `${id}`);

  if (id !== 0) {
    return JSON.parse(itemData);
  } else {
    return undefined;
  }
};

export const loadDungeonItem = async () => {
  const dungeonItemComponent = await getDungeonItems();

  await redisCli.set(`${config.redisKey.dungeonTable}`, JSON.stringify(dungeonItemComponent));
};

export const getDungeonItemsByDungeonCode = async (dungeonCode) => {
  const dungeonItemData = await redisCli.get(`${config.redisKey.dungeonTable}`);

  const dungeonItems = JSON.parse(dungeonItemData).filter((item) => {
    return item.dungeonId === dungeonCode;
  });

  return dungeonItems;
};
