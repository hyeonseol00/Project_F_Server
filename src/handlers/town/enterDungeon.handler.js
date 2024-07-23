
const enterDungeonHandler = async ({ socket, userId, payload }) => {
    try {
      const { dungeonCode } = payload;

      const monsterStatus ={
        monsterIdx,
        monsterModel,
        monsterName,
        monsterHp,
      }

      const dungeonInfo = {
        dungeonCode,
        monsters: monsterStatus,
      }

      const playerStatus = {
        playerClass,
        playerLevel,
        playerName,
        playerFullHp,
        playerFullMp,
        playerCurHp,
        playerCurMp,
      }

      const ScreenTextAlignment = {
        x,
        y,
      }

      const Color = {
        r,
        g,
        b,
      }

      const ScreenText = {
        msg,
        typingAnimation,
        alignment: ScreenTextAlignment,
        textColor : Color,
        screenColor: Color,
      }

      const BtnInfo = {
        msg,
        enable,
      }

      const BattleLog ={
        msg,
        typingAnimation,
        btns: BtnInfo, 
      }

      const enterDungeonResponse = createResponse('response', 'S_EnterDungeon', {
        dungeonInfo : dungeonInfo,
        player : playerStatus,
        ScreenText : ScreenText,
        battleLog : BattleLog,
      });
      


      socket.write(enterDungeonResponse);
    } catch (err) {
      handleError(socket, err);
    }
  };
  
  export default enterDungeonHandler;
  
