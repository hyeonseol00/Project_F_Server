export const TOTAL_LENGTH = 4; // 전체 길이를 나타내는 4바이트
export const PACKET_TYPE_LENGTH = 1; // 패킷타입을 나타내는 1바이트

export const PACKET_TYPE = {
  C_Enter: 0,
  S_Enter: 1,
  S_Spawn: 2,
  S_Despawn: 5,
  C_Move: 6,
  S_Move: 7,
  C_Animation: 8,
  S_Animation: 9,
  C_Chat: 12,
  S_Chat: 13,
  C_EnterDungeon: 14,
  S_EnterDungeon: 16,
  C_PlayerResponse: 15,
  S_LeaveDungeon: 17,
  S_ScreenText: 18,
  S_ScreenDone: 19,
  S_BattleLog: 20,
  S_SetPlayerHp: 21,
  S_SetPlayerMp: 22,
  S_SetMonsterHp: 23,
  S_PlayerAction: 24,
  S_MonsterAction: 25,

  // ********** 100번대 패킷 ********** //
  C_BuyItem: 100,
  S_BuyItem: 101,
  C_SellItem: 102,
  S_SellItem: 103,
  C_UseItem: 104,
  S_UseItem: 105,
  C_EquipWeapon: 106,
  S_EquipWeapon: 107,
  C_UnequipWeapon: 108,
  S_UnequipWeapon: 109,
  // ********** 100번대 패킷 끝 ********** //

  // ********** 150번대 패킷 ********** //
  C_GetQuests: 150, // 유저의 퀘스트 목록 요청
  S_GetQuests: 151, // 유저의 퀘스트 목록 응답
  C_AcceptQuest: 152, // 퀘스트 수락 요청
  S_AcceptQuest: 153, // 퀘스트 수락 응답
  C_UpdateQuest: 154, // 퀘스트 진행 업데이트 요청
  S_UpdateQuest: 155, // 퀘스트 진행 업데이트 응답
  C_CompleteQuest: 156, // 퀘스트 완료 요청
  S_CompleteQuest: 157, // 퀘스트 완료 응답
  // ********** 150번대 패킷 끝 ********** //

  // ********** 200번대 패킷 ********** //
  C_Register: 201,
  S_Register: 202,
  C_LogIn: 203,
  S_LogIn: 204,
  C_EnterHatchery: 205,
  S_EnterHatchery: 206,
  S_SpawnPlayerHatchery: 207,
  C_MoveAtHatchery: 208,
  S_MoveAtHatchery: 209,
  C_AttackBoss: 210,
  S_SetHatcheryBossHp: 211,
  C_TryAttack: 212,
  S_TryAttack: 213,
  S_BossMove: 214,
  C_LeaveHatchery: 215,
  S_BossTryAttack: 216,
  C_PlayerHit: 217,
  S_SetPlayerHpMpHatchery: 218,
  S_DespawnHatchery: 219,
  C_TryUsePotion: 220,
  S_TryUsePotion: 221,
  S_EnterSecondPhase: 222,
  S_EnterThirdPhase: 223,
  S_DisplayNotificationHatchery: 224,
  // ********** 200번대 패킷 끝 ********** //
};
