import { PROCESSING_EVENTS } from '../worldChat.js';

export const BossEndEvent = async (eventId) => {
  try {
    const endedEventIdx = PROCESSING_EVENTS.findIndex((e) => e.eventId === eventId);

    if (endedEventIdx !== -1) PROCESSING_EVENTS.splice(endedEventIdx, 1);
  } catch (err) {
    console.error(err);
  }
};
