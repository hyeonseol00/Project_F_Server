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

    // 아직 던전이 생성되지 않았을 때
    if (!hatcherySession) {
      console.log('던전이 생성되지 않아 이벤트 보스 소환 불가');
      return;
    }

    //보스 출연
    if (hatcherySession.playerNicknames.length > 0) {
      if (bossResponse) {
        const bossInfo = await getMonsterById(bossId);
        hatcherySession.nextBossId = bossId;
        for (const user of allUser) {
          const response = createResponse('response', 'S_Chat', {
            playerId: user.playerId,
            chatMsg: `[Event]: 이벤트 보스 ${bossInfo.monsterName}이(가) 다음 던전에 출현합니다.`,
          });

          user.socket.write(response);
        }
      }
    } else {
      if (bossResponse) {
        const bossInfo = await getMonsterById(bossId);
        hatcherySession.nextBossId = bossId;
        await hatcherySession.initialize();
        for (const user of allUser) {
          const response = createResponse('response', 'S_Chat', {
            playerId: user.playerId,
            chatMsg: `[Event]: 이벤트 보스 ${bossInfo.monsterName}이(가) 출현했습니다.`,
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
