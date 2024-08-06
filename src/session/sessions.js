import Hatchery from '../classes/models/hatchery.class.js';
import { config } from '../config/config.js';

export const userSessions = [];
export const gameSessions = [];
export const instanceDungeonSessions = [];
export const GAAPP = { userCount: 0 };
export const levelTable = [];
export const hatcherySession = new Hatchery(config.hatchery.bossInitTransform);
export const itemTable = [];
