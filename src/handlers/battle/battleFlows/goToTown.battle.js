import switchToGameOverWin from './switchScene/gameOverWin.switch.js';

export default function goToTownScene(responseCode, dungeon, socket) {
  switchToGameOverWin(dungeon, socket);
}
