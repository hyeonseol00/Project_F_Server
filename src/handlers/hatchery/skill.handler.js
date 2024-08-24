import { getPlayerInfo, getStatInfo } from '../../classes/DBgateway/playerinfo.gateway.js';
import { config } from '../../config/config.js';
import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserBySocket, getUserByNickname } from '../../session/user.session.js';
import { createResponse } from '../../utils/response/createResponse.js';

const skillHatcheryHandler = async ({ socket, payload }) => {
  try {
    const player = getUserBySocket(socket);
    const playerStatInfo = await getStatInfo(socket);
    const hatcherySession = getHatcherySession();
    const playerInfo = await getPlayerInfo(socket);
    const jobId = playerInfo.class;

    const { skillTime } = payload;

    //스킬 사용 시 스탯 변경
    if (playerStatInfo.mp < config.skill.manaCost) {
      return;
    } else {
      player.isBuff = true;
      playerStatInfo.mp -= config.skill.manaCost;
      switch (jobId) {
        case 1002:
          hatcherySession.berserkerModeOn(player.nickname);
          break;
        case 1004:
          hatcherySession.invincibilityModeOn(player.nickname);
          break;
        default:
          break;
      }
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

    // 버프 빠지고 다시 스텟 변경
    setTimeout(() => {
      player.isBuff = false;
      switch (jobId) {
        case 1002:
          hatcherySession.berserkerModeOff(player.nickname);
          break;
        case 1004:
          hatcherySession.invincibilityModeOff(player.nickname);
          break;
        default:
          break;
      }
    }, skillTime * 1000);
  } catch (err) {
    console.error(err);
  }
};

export default skillHatcheryHandler;
