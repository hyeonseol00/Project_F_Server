import { GAAPP } from './sessions.js';

export function getRegistCount() {
  return GAAPP.userCount++;
}
