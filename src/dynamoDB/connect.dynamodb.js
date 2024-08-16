import AWS from 'aws-sdk';
import { config } from '../config/config.js';

let docClient;

function lookupFunc() {
  const params = { TableName: config.dynamoDB.awsTableName };
  docClient.scan(params, (err, data) => {
    if (!err) {
      const { Items } = data;
      console.log(Items);
      // 여기에 이벤트 매핑 핸들러로 데이터 던져주기
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
