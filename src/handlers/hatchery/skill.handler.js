import { getStatInfo, setStatInfo } from '../../classes/DBgateway/playerinfo.gateway.js';
import { config } from '../../config/config.js';
import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserBySocket } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const skillHatcheryHandler = async ({ socket, payload }) => {
  try {
    const player = getUserBySocket(socket);
    const playerStatInfo = await getStatInfo(socket);
    const hatcherySession = getHatcherySession();

    const { skillTime } = payload;

    //스킬 사용 시 스탯 변경
    if (playerStatInfo.mp < config.skill.manaCost) {
      return;
    } else {
      playerStatInfo.mp -= config.skill.manaCost;
      playerStatInfo.atk += config.skill.atkBuff;
      playerStatInfo.def += config.skill.defBuff;
      playerStatInfo.critRate += config.skill.critRateBuff;
      playerStatInfo.critDmg += config.skill.critDmgBuff;
    }

    //스킬 사용 시 플레이어 상태 업데이트
    const response = createResponse('response', 'S_TrySkill', {
      playerId: player.playerId,
    });

    const playerHpMpResponse = createResponse('response', 'S_SetPlayerHpMpHatchery', {
      playerId: player.playerId,
      playerCurHp: playerStatInfo.hp,
      playerCurMp: playerStatInfo.mp,
    });

    hatcherySession.playerNicknames.forEach((nickname) => {
      const user = getUserByNickname(nickname);
      user.socket.write(response);
      user.socket.write(playerHpMpResponse);
    });

    await setStatInfo(socket, playerStatInfo);

    // 버프 빠지고 다시 스텟 변경
    setTimeout(async () => {
      const playerStatInfo = await getStatInfo(socket);

      playerStatInfo.atk -= config.skill.atkBuff;
      playerStatInfo.def -= config.skill.defBuff;
      playerStatInfo.critRate -= config.skill.critRateBuff;
      playerStatInfo.critDmg -= config.skill.critDmgBuff;

      await setStatInfo(socket, playerStatInfo);
    }, skillTime);
  } catch (err) {
    console.error(err);
  }
};

export default skillHatcheryHandler;
