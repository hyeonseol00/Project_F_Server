import { createLocationPacket } from '../../utils/notification/game.notification.js';
import IntervalManager from '../managers/interval.manager.js';

const MAX_PLAYERS = 10;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.intervalManager = new IntervalManager();
    this.state = 'waiting'; // 'waiting', 'inProgress'
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) throw new Error('게임 세션에 자리가 없습니다!');
    this.users.push(user);

    // this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
    if (this.users.length === MAX_PLAYERS) setTimeout(() => this.startGame(), 3000);
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  getAllUserIds() {
    const userIds = this.users.map((user) => user.id);

    return userIds;
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    this.intervalManager.removePlayer(userId);

    if (this.users.length < MAX_PLAYERS) this.state = 'waiting';
  }

  startGame() {
    this.state = 'inProgress';
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });

    return maxLatency;
  }

  getAllLocation(userId, newX, newY) {
    const maxLatency = this.getMaxLatency();

    const locationData = this.users.map((user) => {
      let [argX, argY] = [newX, newY];
      if (user.id != userId) [argX, argY] = [0, 0];

      const { x, y } = user.calculatePosition(maxLatency, argX, argY);

      if (user.id == userId) user.updatePosition(x, y);

      return { id: user.id, playerId: user.playerId, x, y };
    });

    return createLocationPacket(locationData);
  }
}

export default Game;
