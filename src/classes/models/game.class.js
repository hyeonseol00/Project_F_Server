import IntervalManager from '../managers/interval.manager.js';

const MAX_PLAYERS = 10;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.intervalManager = new IntervalManager();
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('게임 세션에 자리가 없습니다!');
    }
    this.users.push(user);

    if (this.users.length === MAX_PLAYERS) {
      setTimeout(() => this.startGame(), 3000);
    }
  }

  getUser(userId) {
    return this.users.find((user) => user.playerId === userId);
  }

  getAllUserIds() {
    const userIds = this.users.map((user) => user.nickname);

    return userIds;
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.playerId !== userId);
    this.intervalManager.removePlayer(userId);
  }
}

export default Game;
