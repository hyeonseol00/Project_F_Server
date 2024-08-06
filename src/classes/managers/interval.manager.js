import BaseManager from './base.manager.js';

class IntervalManager extends BaseManager {
  constructor() {
    super();
    this.intervals = new Map();
  }

  addPlayer(playerId, callback, interval, type = 'user') {
    if (!this.intervals.has(playerId)) this.intervals.set(playerId, new Map());

    this.intervals.get(playerId).set(type, setInterval(callback, interval));
  }

  // 특정 인터벌만 삭제
  removeInterval(playerId, type) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);

      if (userIntervals.has(type)) {
        clearInterval(userIntervals.get(type));
        userIntervals.delete(type);
      }
    }
  }

  // 특정 플레이어가 가진 인터벌 전체 삭제
  removePlayer(playerId) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
      this.intervals.delete(playerId);
    }
  }

  // 인스턴스에 등록된 인터벌 전체 삭제
  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((intervalId) => clearInterval(intervalId));
    });
    this.intervals.clear();
  }
}

export default IntervalManager;
