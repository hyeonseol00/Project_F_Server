import { config } from '../config/config.js';
import { addGameSession } from '../session/game.session.js';
import { testAllConnections } from '../utils/db/testConnection.js';
import { loadProtos } from './loadProtos.js';
import { loadLevelTable } from '../session/level.session.js';
import { loadItemTable } from '../session/item.session.js';
import { loadMonsterTable } from '../session/monster.session.js';

const initServer = async () => {
  try {
    await loadProtos();
    await testAllConnections();
    addGameSession(config.session.townId);
    await loadLevelTable();
    await loadItemTable();
    await loadMonsterTable();
  } catch (err) {
    console.error(err);
    process.exit(1); // 오류 발생 시 프로세스 종료
  }
};

export default initServer;
