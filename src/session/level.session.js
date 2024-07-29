import level from "../classes/models/level.class";
import { levelTable } from "./sessions";

export const getLevelById = (levelId) => {
  return levelTable.find((level) => level.levelId === levelId);
};

export const addLevel = (level) => {
    levelTable.push(level);
};