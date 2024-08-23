import {
  getPlayerInfo,
  getStatInfo,
  setStatInfo,
} from '../../classes/DBgateway/playerinfo.gateway.js';
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
      switch (jobId) {
        case 1001:
          // 창술사 스킬: 5초 동안 공격속도(300%), 이동속도(500%), 공격 범위(5배 증가)가 대폭 증가합니다(쿨타임 15초)
          // 클라이언트 처리
          break;
        case 1002:
          // 검사 스킬: 10초 동안 치명타 확률(+50%), 치명타 데미지(+100%)가 대폭 증가하며, 체력이 1 이하로 내려가지 않습니다(쿨타임 20초)
          playerStatInfo.critRate += config.skill.critRateBuff;
          playerStatInfo.critDmg *= 2;
          hatcherySession.berserkerModeOn(player.nickname);
          break;
        case 1003:
          // 궁수 스킬: 7초 동안 최대 공격 속도(5.0)가 됩니다. (쿨타임 15초 )
          // 클라이언트 처리
          break;
        case 1004:
          // 디스트로이어 스킬: 공격 속도(60% 감소)와 이동 속도(50% 감소)가 대폭 감소합니다. 대신, 10초 동안 몸집이 커지며, 무적이 됩니다.  공격 적중 시 공격력의 3배만큼 피해를 줍니다(쿨타임 15초
          playerStatInfo.atk *= config.skill.atkBuff;
          hatcherySession.invincibilityModeOn(player.nickname);
          break;
        case 1005:
          // 마법사 스킬: 10초 동안 강화된 구체(크기 2배, 데미지 = magic 계수)로 공격합니다.(쿨타임 20초)
          // atk, magic 서로 10초 동안 서로 바꿔놓기
          const t = playerStatInfo.atk;
          playerStatInfo.atk = playerStatInfo.magic;
          playerStatInfo.magic = t;
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

    await setStatInfo(socket, playerStatInfo);

    // 버프 빠지고 다시 스텟 변경
    setTimeout(async () => {
      const playerStatInfo = await getStatInfo(socket);

      switch (jobId) {
        case 1001:
          // 창술사 스킬: 5초 동안 공격속도(300%), 이동속도(500%), 공격 범위(5배 증가)가 대폭 증가합니다(쿨타임 15초)
          // 클라이언트 처리
          break;
        case 1002:
          //  스킬: 10초 동안 치명타 확률(+50%), 치명타 데미지(+100%)가 대폭 증가하며, 체력이 1 이하로 내려가지 않습니다(쿨타임 20초)
          playerStatInfo.critRate -= config.skill.critRateBuff;
          playerStatInfo.critDmg /= 2;
          hatcherySession.berserkerModeOff(player.nickname);
          break;
        case 1003:
          // 궁수 스킬: 7초 동안 최대 공격 속도(5.0)가 됩니다. (쿨타임 15초 )
          // 클라이언트 처리
          break;
        case 1004:
          // 디스트로이어 스킬: 공격 속도(60% 감소)와 이동 속도(50% 감소)가 대폭 감소합니다. 대신, 10초 동안 몸집이 커지며, 무적이 됩니다.  공격 적중 시 공격력의 3배만큼 피해를 줍니다(쿨타임 15초
          playerStatInfo.atk /= config.skill.atkBuff;
          hatcherySession.invincibilityModeOff(player.nickname);
          break;
        case 1005:
          // 마법사 스킬: 10초 동안 강화된 구체(크기 2배, 데미지 = magic 계수)로 공격합니다.(쿨타임 20초)
          // atk, magic 서로 10초 동안 서로 바꿔놓기
          const t = playerStatInfo.atk;
          playerStatInfo.atk = playerStatInfo.magic;
          playerStatInfo.magic = t;
          break;
      }
      await setStatInfo(socket, playerStatInfo);
    }, skillTime * 1000);
  } catch (err) {
    console.error(err);
  }
};

export default skillHatcheryHandler;
