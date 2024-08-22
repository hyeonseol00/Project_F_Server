import { getHatcherySession } from '../../session/hatchery.session.js';
import { getUserByNickname, getUserBySocket } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const hatcherySelectRewardHandler = async ({ socket, payload }) => {
  try {
    const user = getUserBySocket(socket);
    const hatcherySession = getHatcherySession();

    const confirmRewardResponse = createResponse('response', 'S_HatcheryConfirmReward', {
      selectedBtn: payload.selectedBtn,
      btnTexts: ['아이템 1', '아이템 2', '아이템 3', '아이템 4', '아이템 5', '아이템 6'],
      message:
        `${user.nickname}님께서 ${'아이템 이름'}을 획득했습니다!\n` +
        `${hatcherySession.boss.exp} 경험치를 획득했습니다.\n\n` +
        '잠시 후 마을로 귀환합니다.',
    });

    for (const nickname of hatcherySession.playerNicknames) {
      const target = getUserByNickname(nickname);
      target.socket.write(confirmRewardResponse);
    }
  } catch (err) {
    handleError(socket, err);
  }
};

export default hatcherySelectRewardHandler;
