import { getPlayerInfo } from '../DBgateway/playerinfo.gateway.js';
import IntervalManager from '../managers/interval.manager.js';

const MAX_PLAYERS = 10;

class Game {
  constructor(id) {
    this.id = id;
    this.playerNicknames = [];
    this.transforms = {};
    /* this.transforms = {
      nickname: { posX: 0, posY: 0, posZ: 0, rot: 0 },
      nickname2: { posX: 0, posY: 0, posZ: 0, rot: 0 },
    }; */
  }

  addUser(nickname) {
    if (this.playerNicknames.length >= MAX_PLAYERS) {
      throw new Error('게임 세션에 자리가 없습니다!');
    }
    this.playerNicknames.push(nickname);
  }

  getAllUserIds() {
    return this.playerNicknames;
  }

  removeUser(nickname) {
    this.playerNicknames = this.playerNicknames.filter((ele) => ele !== nickname);
  }
}

export default Game;
