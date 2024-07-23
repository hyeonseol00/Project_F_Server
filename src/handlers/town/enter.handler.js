import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';
import { addUser } from '../../session/user.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

const enterTownHandler = ({ socket, userId, payload }) => {
  try {
    const { nickname } = payload;
    const characterClass = payload.class;
    const gameSession = getGameSession(config.session.id);

    const user = addUser(socket, nickname);
    gameSession.addUser(user);

    const transformInfo = {
      posX: 0,
      posY: 1,
      posZ: 0,
      rot: 0,
    };
    const statInfo = {
      level: 1,
      hp: 100,
      maxHp: 100,
      mp: 100,
      maxMp: 100,
      atk: 10,
      def: 10,
      magic: 10,
      speed: 10,
    };
    const playerInfo = {
      playerId: user.id,
      nickname,
      class: characterClass,
      transform: transformInfo,
      statInfo,
    };
    const enterTownResponse = createResponse('response', 'S_Enter', {
      player: playerInfo,
    });

    console.log('현재 접속 중인 유저: ', gameSession.getAllUserIds());

    socket.write(enterTownResponse);
  } catch (err) {
    handleError(socket, err);
  }
};

export default enterTownHandler;
