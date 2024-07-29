import { config } from '../../../../config/config.js';
import { createResponse } from '../../../../utils/response/createResponse.js';

export default function switchToGameOverWin(dungeon, socket) {
  const btns = [{ msg: '마을로 귀환', enable: true }];
  const battleLog = {
    msg: `마을로 귀환하겠습니다!`,
    typingAnimation: false,
    btns,
  };
  const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
  socket.write(responseBattleLog);

  dungeon.battleSceneStatus = config.sceneStatus.gameOverWin;
}
