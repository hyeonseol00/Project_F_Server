import switchToActionScene from './switchScene/action.switch.js';

export default async function messageWindowScene(responseCode, dungeon, socket) {
  if (responseCode == 0) {
    await switchToActionScene(dungeon, socket);
  }
}
