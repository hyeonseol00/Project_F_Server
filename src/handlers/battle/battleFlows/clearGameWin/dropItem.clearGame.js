import { config } from '../../../../config/config.js';
import { createResponse } from '../../../../utils/response/createResponse.js';

export default async function dropItemScene(responseCode, dungeon, socket) {
  const selectNumber = responseCode - 1;
  const items = [dungeon.getRandomItem(), dungeon.getRandomItem(), dungeon.getRandomItem()];
  dungeon.selectItem = items[selectNumber];

  const btns = [
    { msg: `${items[0].name} x${items[0].quantity}`, enable: false },
    { msg: `${items[1].name} x${items[1].quantity}`, enable: false },
    { msg: `${items[2].name} x${items[2].quantity}`, enable: false },
  ];
  btns[selectNumber].enable = true;

  const battleLog = {
    msg: `보상을 획득하세요!`,
    typingAnimation: false,
    btns,
  };
  const responseBattleLog = createResponse('response', 'S_BattleLog', { battleLog });

  socket.write(responseBattleLog);

  dungeon.battleSceneStatus = config.sceneStatus.goToTown;
}
