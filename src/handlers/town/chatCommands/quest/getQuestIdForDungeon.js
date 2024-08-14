export const getQuestIdForDungeon = (dungeonId) => {
  const dungeonQuestMapping = {
    5001: 1, // 1성 던전 (ID: 5001) -> 퀘스트 ID 1
    5002: 2, // 2성 던전 (ID: 5002) -> 퀘스트 ID 2
    5003: 3, // 3성 던전 (ID: 5002) -> 퀘스트 ID 3
    5004: 4, // 4성 던전 (ID: 5002) -> 퀘스트 ID 4
  };

  return dungeonQuestMapping[dungeonId] || null;
};
