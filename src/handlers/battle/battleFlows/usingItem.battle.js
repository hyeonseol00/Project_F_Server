import switchToActionScene from './switchScene/action.switch.js';

export default function usingItemScene(responseCode, dungeon, socket) {
  switchToActionScene(dungeon, socket);
}
