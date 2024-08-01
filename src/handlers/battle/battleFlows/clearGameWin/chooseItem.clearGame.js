import { config } from '../../../../config/config.js';
import { createResponse } from '../../../../utils/response/createResponse.js';

export default async function chooseItemScene(responseCode, dungeon, socket) {
  const btns = [
    { msg: 'A', enable: true },
    { msg: 'B', enable: true },
    { msg: 'C', enable: true },
    { msg: 'D', enable: true },
    { msg: 'E', enable: true },
    { msg: 'F', enable: true },
  ];
  const battleLog = {
    msg: `보상을 선택하세요!`,
    typingAnimation: false,
    btns,
  };
  const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });

  socket.write(responseBattleLog);

  dungeon.battleSceneStatus = config.sceneStatus.itemDrop;
}
