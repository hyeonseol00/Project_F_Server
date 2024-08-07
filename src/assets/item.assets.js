import { getAllItemData, getDungeonItems } from '../db/game/game.db.js';
import { dungeonItem, itemTable } from './assets.js';

export const getItemById = (itemId) => {
  if (itemId !== 0) {
    return itemTable.find((item) => item.itemId === itemId);
  } else {
    return undefined;
  }
};

export const loadItemTable = async () => {
  const itemComponent = await getAllItemData();
  itemComponent.forEach((item) => {
    itemTable.push(item);
  });
};

export const getItemCostbyId = (itemId) => {
  const item = getItemById(itemId);
  if (item) {
    return item.itemCost;
  } else {
    return 0;
  }
};

export const loadDungeonItem = async () => {
  const dungeonItemComponent = await getDungeonItems();
  dungeonItemComponent.forEach((item) => {
    dungeonItem.push(item);
  });
};

export const getDungeonItemsByDungeonCode = (dungeonCode) => {
  const dungeonItems = dungeonItem.filter((item) => {
    return item.dungeonId === dungeonCode;
  });

  return dungeonItems;
};
