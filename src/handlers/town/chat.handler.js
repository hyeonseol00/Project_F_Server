import { handleError } from '../../utils/error/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { getUserBySocket, getAllUsers } from '../../session/user.session.js';
import { config } from '../../config/config.js';
import { getGameSession } from '../../session/game.session.js';
import chatCommands from '../chatCommands.js';

const chatHandler = async ({ socket, payload }) => {
  const { playerId, chatMsg } = payload;
  try {
    const user = getUserBySocket(socket);
    if (!user) throw new Error('유저를 찾을 수 없습니다.');

    // 게임 세션을 가져옵니다.
    const gameSession = getGameSession(config.session.townId);
    if (!gameSession) throw new Error('게임 세션을 찾을 수 없습니다.');

    // '/'으로 시작하면 채팅 명령어, 그렇지 않으면 전체 채팅으로 판단한다.
    if(chatMsg[0] === '/'){
      const { commandType, message } = parseCommand(chatMsg);

      // 해당 커멘트에 맞는 핸들러를 가져오고 실행합니다.
      const chatCommandHandler = chatCommands.get(commandType);
      if(!chatCommandHandler){
        const invalidCommandResponse = createResponse('response', 'S_Chat', {
          playerId: user.playerId,
          chatMsg: `[System] Invalid Command: Please check your command`,
        });
        socket.write(invalidCommandResponse);
        return;
      }
      
      chatCommandHandler(user, message);

      // console.log(chatCommandHandler);
    }
    else{
      // 전체 채팅 실행.
      sendGlobalMessage(user, chatMsg); 
    }

  } catch (err) {
    handleError(socket, err.message, '채팅 전송 중 에러가 발생했습니다: ' + err.message);
  }
};

function parseCommand(command) {

  const firstSpaceIdx = command.indexOf(' ');

  let commandType, message;

  if(firstSpaceIdx === -1){
    commandType = command.substring(1); // /w, /team 같은 명령어 파싱
    message = "";
    return {commandType, message};
  }
  commandType = command.substring(1, firstSpaceIdx); // /w, /team 같은 명령어 파싱
  message = command.substring(firstSpaceIdx + 1);                  
  
  return { commandType, message }; 
}

function sendGlobalMessage(sender, message) {
  const allUsers = getAllUsers();

  const chatResponse = createResponse('response', 'S_Chat', {
    playerId: sender.playerId,
    chatMsg: message,
  });

  allUsers.forEach(user => {
    user.socket.write(chatResponse);
  });

  // console.log(`Global message from ${sender.nickname}: ${message}`);
}

export default chatHandler;



