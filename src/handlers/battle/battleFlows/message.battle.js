import switchToActionScene from './switchScene/action.switch.js';

export default function messageWindowScene(responseCode, dungeon, socket) {
  if (responseCode == 0) {
    switchToActionScene(dungeon, socket);
  }
}
