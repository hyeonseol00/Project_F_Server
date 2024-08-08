import { removeDungeon } from '../../../session/dungeon.session.js';
import { createResponse } from '../../../utils/response/createResponse.js';

const respawnHp = 50;
export default function gameOverLoseScene(responseCode, dungeon, socket) {
  const nickname = dungeon.player.nickname;

  const user = dungeon.player; // user 클래스
  const playerStatus = user.playerInfo.statInfo;
  playerStatus.hp = respawnHp; // 플레이어 사망 시 체력 50으로 마을로 귀한

  if (responseCode == 1) {
    const responseLeaveDungeon = createResponse('response', 'S_LeaveDungeon', {});
    socket.write(responseLeaveDungeon);

    removeDungeon(nickname);
  }
}
