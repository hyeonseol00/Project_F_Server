import AWS from 'aws-sdk';
import { config } from '../config/config.js';
import { eventNotificationHandler } from '../Lambda/worldChat.js';
import { toCamelCase } from '../utils/transformCase.js';

let docClient;

async function lookupFunc() {
  const params = { TableName: config.dynamoDB.awsTableName };

  try {
    const data = await docClient.scan(params).promise();
    const camelData = toCamelCase(data.Items);

    if (camelData.length >= 1) {
      for (const event of camelData) {
        // 이벤트 처리 중 상태로 업데이트
        const updateParams = {
          TableName: config.dynamoDB.awsTableName,
          Key: { id: event.id },
          UpdateExpression:
            'SET processedCount = if_not_exists(processedCount, :zero) + :increment',
          ExpressionAttributeValues: {
            ':zero': 0,
            ':increment': 1,
          },
          ReturnValues: 'UPDATED_NEW',
        };

        try {
          const updateData = await docClient.update(updateParams).promise();
          const { processedCount } = updateData.Attributes;

          // 이벤트 핸들링
          eventNotificationHandler(event);

          console.log('이벤트 진행 횟수 : ', processedCount);

          if (processedCount >= config.server.count) {
            const deleteParams = {
              TableName: config.dynamoDB.awsTableName,
              Key: { id: event.id },
            };

            await docClient.delete(deleteParams).promise();
            console.log('DynamoDB 데이터 삭제 성공!');
          }
        } catch (updateErr) {
          if (updateErr.code === 'ConditionalCheckFailedException') {
            console.log(`이 이벤트는 이미 다른 서버에 의해 처리되었습니다. 이벤트 ID: ${event.id}`);
          } else {
            console.log('이벤트 상태 업데이트 실패', updateErr);
          }
        }
      }
    }
  } catch (err) {
    console.log('DynamoDB 데이터 읽는 중 오류 발생!', err);
  }
}

export default function initDynamoDB() {
  try {
    AWS.config.update(config.dynamoDB.awsRemoteConfig);
    docClient = new AWS.DynamoDB.DocumentClient();

    setInterval(lookupFunc, config.dynamoDB.lookupInterval);

    console.log('dynamoDB 연결 성공!');
  } catch (err) {
    console.log('dynamoDB 연결 실패 : ', err);
  }
}
