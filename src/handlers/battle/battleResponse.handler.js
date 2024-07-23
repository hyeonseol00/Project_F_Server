import { getDungeonByUserId } from '../../session/dungeon.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const battleResponseHandler = async ({ socket, payload }) => {
  const user = getUserBySocket(socket);
  const dungeon = getDungeonByUserId(user.playerId);
  // 하드코딩 예외처리. 클라이언트 수정 요망
  const responseCode = payload.responseCode ? payload.responseCode : 0;

  switch (responseCode) {
    case 0:
      const btns = [];
      for (let i = 0; i < dungeon.monsters.length; i++) {
        const monster = dungeon.monsters[i];
        btns.push({ msg: `${monster.name}`, enable: true });
      }
      btns.push({ msg: '도망치기', enable: true });
      const battleLog = {
        msg: '공격할 몬스터를 선택하세요.',
        typingAnimation: true,
        btns,
      };
      const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
      const responseScreenDone = createResponse('response', 'S_ScreenDone', {});

      socket.write(responseBattleLog);
      socket.write(responseScreenDone);
      break;
    case dungeon.monsters.length + 1:
      // S_LeaveDungeon
      console.log('S_LeaveDungeon');
      {
        const battleLog = {
          msg: '도망칩니다!',
          typingAnimation: true,
          btns: [],
        };

        const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
        socket.write(responseBattleLog);
      }
      setTimeout(function () {
        const responseLeaveDungeon = createResponse('response', 'S_LeaveDungeon', {});
        socket.write(responseLeaveDungeon);
      }, 1000);

      break;
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      break;
  }
};

export default battleResponseHandler;
