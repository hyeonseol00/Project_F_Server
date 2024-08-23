import { createResponse } from '../../../utils/response/createResponse.js';
import { BossEndEvent } from '../BossEndEvent.js';
import { getAllUsers } from '../../../session/user.session.js';
import { getHatcherySession } from '../../../session/hatchery.session.js';
import { config } from '../../../config/config.js';
import { getMonsterById } from '../../../assets/monster.assets.js';

export const worldBossEventHandler = async (payload) => {
  try {
    const { bossResponse, bossId } = payload;

    const hatcherySession = getHatcherySession();
    const allUser = getAllUsers();

    //보스 출연
    if (hatcherySession.playerNicknames.length > 0) {
      for (const user of allUser) {
        const response = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[Event]: 이벤트 보스 ${hatcherySession.boss.monsterName}에 도전하는 용사님이 있습니다.`,
        });

        user.socket.write(response);
      }
    } else {
      if (bossResponse) {
        const bossInfo = await getMonsterById(bossId);
        hatcherySession.changeMonster({ ...config.hatchery.bossInitTransform }, bossId);
        for (const user of allUser) {
          const response = createResponse('response', 'S_Chat', {
            playerId: user.playerId,
            chatMsg: `[Event]: 이벤트 보스 ${bossInfo.monsterName}이(가) 출연하였습니다.`,
          });

          user.socket.write(response);
        }
      }
    }
    BossEndEvent(3);
  } catch (err) {
    console.error(err);
  }
};
