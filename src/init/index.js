import { config } from '../config/config.js';
import { addGameSession } from '../session/game.session.js';
import { testAllConnections } from '../utils/db/testConnection.js';
import { loadProtos } from './loadProtos.js';
import { loadLevelTable } from '../assets/level.assets.js';
import { loadDungeonItem, loadItemTable } from '../assets/item.assets.js';
import { loadMonsterTable } from '../assets/monster.assets.js';
import { loadDungeonMonster } from '../assets/monster.assets.js';
import { redisClient } from './redis.js';
const initServer = async () => {
  try {
    redisClient;
    await loadProtos();
    await testAllConnections();
    addGameSession(config.session.townId);
    await loadLevelTable();
    await loadItemTable();
    await loadMonsterTable();
    await loadDungeonMonster();
    await loadDungeonItem();
  } catch (err) {
    console.error(err);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;
