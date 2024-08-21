import AWS from 'aws-sdk';
import { config } from '../config/config.js';
import { eventNotificationHandler } from '../Lambda/worldChat.js';
import { toCamelCase } from '../utils/transformCase.js';
import EventEmitter from 'events';

let docClient;

async function lookupFunc() {
  const params = {
    TableName: config.dynamoDB.awsTableName,
    FilterExpression: 'attribute_not_exists(eventStatus) OR eventStatus = :pending',
    ExpressionAttributeValues: { ':pending': 'pending' },
  };

  await docClient.scan(params, (err, data) => {
    if (!err) {
      const { Items } = data;
      const camelData = toCamelCase(Items);

      if (Items.length >= 1) {
        camelData.forEach((event) => {
          // 이벤트 처리 중 상태로 업데이트
          const updateParams = {
            TableName: config.dynamoDB.awsTableName,
            Key: { id: event.id },
            UpdateExpression:
              'SET processedCount = if_not_exists(processedCount, :zero) + :increment',
            ExpressionAttributeValues: {
              ':zero': 0,
              ':increment': 1,
              ':inProgress': 'inProgress',
            },
            ReturnValues: 'UPDATED_NEW',
            ConditionExpression: 'attribute_not_exists(eventStatus) OR eventStatus = :pending',
          };

          docClient.update(updateParams, (updateErr, updateData) => {
            if (!updateErr) {
              const { processedCount } = updateData.Attributes;
              // 이벤트 핸들링
              eventNotificationHandler(event);

              console.log('이벤트 진행 횟수 : ', processedCount);

              if (processedCount >= 2) {
                const deleteParams = {
                  TableName: config.dynamoDB.awsTableName,
                  Key: { id: event.id },
                };

                docClient.delete(deleteParams, (deleteErr, deleteData) => {
                  if (!deleteErr) {
                    console.log('DynamoDB 데이터 삭제 성공!', deleteData);
                  } else {
                    console.log('DynamoDB 데이터 삭제 실패!', deleteErr);
                  }
                });
              }
            } else {
              console.log('이벤트 상태 업데이트 실패', updateErr);
            }
          });
        });
      }
    } else {
      console.log('dynamoDB 데이터 읽는 중 오류 발생!', err);
    }
  });
}

// function lookupFunc() {
//   const params = { TableName: config.dynamoDB.awsTableName };

//   docClient.scan(params, (err, data) => {
//     if (!err) {
//       const { Items } = data;
//       const camelData = toCamelCase(Items);
//       if (Items.length >= 1) {
//         // 여기에 이벤트 매핑 핸들러로 데이터 던져주기
//         camelData.forEach((event) => {
//           eventNotificationHandler(event);

//           setTimeout(() => {
//             params.Key = { id: event.id };
//             docClient.delete(params, (err, data) => {
//               if (!err) {
//                 console.log('DynamoDB 데이터 삭제 성공!', data);
//               } else {
//                 console.log('DynamoDB 데이터 삭제 실패!', err);
//               }
//             });
//           }, 36000);
//         });
//       }
//     } else {
//       console.log('dynamoDB 데이터 읽는 중 오류 발생!', err);
//     }
//   });
// }

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

export default function initDynamoDB() {
  try {
    AWS.config.update(config.dynamoDB.awsRemoteConfig);
    docClient = new AWS.DynamoDB.DocumentClient();

    myEmitter.on('triggerScan', async () => {
      await lookupFunc();
    });

    setInterval(() => {
      myEmitter.emit('triggerScan');
    }, config.dynamoDB.lookupInterval);
    // setInterval(lookupFunc, config.dynamoDB.lookupInterval);

    console.log('dynamoDB 연결 성공!');
  } catch (err) {
    console.log('dynamoDB 연결 실패 : ', err);
  }
}
