import Hatchery from '../classes/models/hatchery.class.js';
import { loadQuestsIntoSession } from './quest.session.js';

export const userSessions = [];
export const gameSessions = [];
export const instanceDungeonSessions = [];
export const questSessions = []; //퀘스트
export const GAAPP = { userCount: 0 };
export const hatcherySession = new Hatchery();

// 서버가 시작될 때 퀘스트 데이터를 세션에 로드
loadQuestsIntoSession();
