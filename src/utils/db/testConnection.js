import pools from '../../db/database.js';

const testDbConnection = async (pool, dbName) =>
{
	try
	{
		const [rows] = await pool.query('SELECT 1 + 1 AS solution');
		console.log(`${dbName} 테스트 쿼리 결과:`, rows[0].solution);
	}
	catch (err)
	{
		console.error(`${dbName} 테스트 쿼리 실행 중 오류 발생:`, err);
	}
};

const testAllConnections = async () =>
{
	await testDbConnection(pools.USER_COORDINATES, 'USER_COORDINATES');
};

export { testDbConnection, testAllConnections };
