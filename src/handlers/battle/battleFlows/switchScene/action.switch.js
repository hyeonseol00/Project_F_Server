import { config } from '../../../../config/config.js';
import { createResponse } from '../../../../utils/response/createResponse.js';

export default function switchToActionScene(dungeon, socket) {
  const btns = [];
  btns.push({ msg: '일반 공격', enable: true });
  btns.push({ msg: '스킬 사용', enable: true });
  btns.push({ msg: '도망치기', enable: true });

  const battleLog = {
    msg: '무엇을 할까요?',
    typingAnimation: false,
    btns: btns,
  };
  const responseScreenDone = createResponse('response', 'S_ScreenDone', {});
  socket.write(responseScreenDone);

  const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });
  socket.write(responseBattleLog);

  dungeon.battleSceneStatus = config.sceneStatus.action;
}
