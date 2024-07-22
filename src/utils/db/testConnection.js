import {
  findCharacterByUserIdAndClass,
  findUserByUsername,
  insertCharacter,
  insertUserByUsername,
} from '../../db/backup/coordinates.db.js';
import pools from '../../db/database.js';

const testDbConnection = async (pool, dbName) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log(`${dbName} 테스트 쿼리 결과:`, rows[0].solution);
    // enter.handler.js
    const username = 'test_user3';
    const jobId = 3;
    let user = await findUserByUsername(username);
    if (!user) {
      console.log(`${username} user 생성`);
      await insertUserByUsername(username);
      user = await findUserByUsername(username);
    }
    console.log(user);
    let character = await findCharacterByUserIdAndClass(user.userId, jobId);
    if (!character) {
      console.log(`${jobId} character 생성`);
      await insertCharacter(user, jobId);
      character = await findCharacterByUserIdAndClass(user.userId, jobId);
    }
    console.log(character);
  } catch (err) {
    console.error(`${dbName} 테스트 쿼리 실행 중 오류 발생:`, err);
  }
};

const testAllConnections = async () => {
  await testDbConnection(pools.USER_COORDINATES, 'USER_COORDINATES');
};

export { testDbConnection, testAllConnections };
