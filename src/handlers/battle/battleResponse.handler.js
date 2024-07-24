import { getDungeonByUserId, removeDungeon } from '../../session/dungeon.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const battleResponseHandler = async ({ socket, payload }) => {
  const user = getUserBySocket(socket);
  const dungeon = getDungeonByUserId(user.nickname);
  const responseCode = payload.responseCode ? payload.responseCode : 0;

  switch (responseCode) {
    case 0:
      // 초기에만 버튼 세팅
      {
        if (dungeon.btns.length === 0) {
          for (let i = 0; i < dungeon.monsters.length; i++) {
            const monster = dungeon.monsters[i];
            dungeon.btns.push({ msg: `${monster.name}`, enable: true });
          }
          dungeon.btns.push({ msg: '도망치기', enable: true });
        }
        const battleLog = {
          msg: '공격할 몬스터를 선택하세요.',
          typingAnimation: true,
          btns: dungeon.btns,
        };
        const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
        const responseScreenDone = createResponse('response', 'S_ScreenDone', {});

        socket.write(responseBattleLog);
        socket.write(responseScreenDone);
      }
      break;
    case dungeon.btns.length:
      {
        // 도망치기 버튼
        console.log('S_LeaveDungeon');
        for (let i = 0; i < dungeon.btns.length; i++) {
          dungeon.btns[i].enable = false;
        }

        const battleLog = {
          msg: '도망칩니다!',
          typingAnimation: true,
          btns: dungeon.btns,
        };

        const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
        socket.write(responseBattleLog);

        setTimeout(function () {
          const responseLeaveDungeon = createResponse('response', 'S_LeaveDungeon', {});
          socket.write(responseLeaveDungeon);
        }, 1000);

        removeDungeon(user.nickname);
      }
      break;
    default:
      // 몬스터 공격 버튼 중 1택
      {
        const targetMonsterIdx = responseCode - 1;
        const effectCode = 3017;
        console.log(`몬스터${targetMonsterIdx} 공격!`);
        for (let i = 0; i < dungeon.btns.length; i++) {
          dungeon.btns[i].enable = true;
        }

        const battleLog = {
          msg: `몬스터${targetMonsterIdx} 공격!`,
          typingAnimation: true,
          btns: dungeon.btns,
        };

        const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
        socket.write(responseBattleLog);

        const actionSet = {
          animCode: 0,
          effectCode,
        };
        // 플레이어 공격 모션은 안 나옴..

        const responsePlayerAction = createResponse('response', 'S_PlayerAction', {
          targetMonsterIdx,
          actionSet,
        });
        socket.write(responsePlayerAction);
      }
      break;
  }
};

export default battleResponseHandler;
