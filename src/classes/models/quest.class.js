class Quest {
  constructor(
    questId,
    questName,
    questDescription,
    questLevel,
    monsterCount,
    rewardExp,
    rewardGold,
  ) {
    this.questId = questId;
    this.questName = questName;
    this.questDescription = questDescription;
    this.questLevel = questLevel;
    this.monsterCount = monsterCount;
    this.rewardExp = rewardExp;
    this.rewardGold = rewardGold;
    this.status = 'NOT_STARTED'; // 초기 상태는 NOT_STARTED
    this.progress = 0;
  }

  startQuest() {
    this.status = 'IN_PROGRESS';
  }

  updateProgress(count) {
    this.progress += count;
    if (this.progress >= this.monsterCount) {
      this.completeQuest();
    }
  }

  completeQuest() {
    this.status = 'COMPLETED';
  }

  resetQuest() {
    this.status = 'NOT_STARTED';
    this.progress = 0;
  }
}

export default Quest;
