import switchToGameOverWin from './switchScene/gameOverWin.switch.js';

export default function goToTownScene(responseCode, dungeon, socket) {
  if (responseCode === 1) {
    switchToGameOverWin(dungeon, socket);
  }
}
