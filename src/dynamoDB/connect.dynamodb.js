import AWS from 'aws-sdk';
import { config } from '../config/config.js';
import { eventNotificationHandler } from '../Lambda/worldChat.js';
import { toCamelCase } from '../utils/transformCase.js';

let docClient;

function lookupFunc() {
  const params = { TableName: config.dynamoDB.awsTableName };

  docClient.scan(params, (err, data) => {
    if (!err) {
      const { Items } = data;
      const camelData = toCamelCase(Items);
      if (Items.length >= 1) {
        // 여기에 이벤트 매핑 핸들러로 데이터 던져주기
        camelData.forEach((event) => {
          eventNotificationHandler(event);

          params.Key = { id: event.id };
          docClient.delete(params, (err, data) => {
            if (!err) {
              console.log('DynamoDB 데이터 삭제 성공!', data);
            } else {
              console.log('DynamoDB 데이터 삭제 실패!', err);
            }
          });
        });
      }
    } else {
      console.log('dynamoDB 데이터 읽는 중 오류 발생!', err);
    }
  });
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
