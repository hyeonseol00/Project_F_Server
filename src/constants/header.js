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
  // ********** 100번대 패킷 끝 ********** //

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
  // ********** 200번대 패킷 끝 ********** //
};
