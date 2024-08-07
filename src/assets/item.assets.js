import { getAllItemData } from '../db/game/game.db.js';
import { itemTable } from './assets.js';

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
