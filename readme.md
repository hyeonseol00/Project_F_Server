# 파이어펀치 - Project F

## 🎈 팀 노션

### [팀노션](https://teamsparta.notion.site/190b940df29049249a92d59fc85cae0d)

## ✨ AWS 배포 링크

### [AWS링크]

## 👋 소개

- **파이어 펀치**는 만화 파이어 펀치의 한 장면을 떠올리고 지은 팀명이며, 힘들지만 밝은 미래를 위해 나아가고자 이러한 팀 이름으로 지었습니다.
- 우리 팀은 **protobuf를 이용한 서버주도 턴제 RPG 게임**을 제작했습니다.

## 👩‍💻 팀원

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/hyeonseol00"><img src="https://avatars.githubusercontent.com/u/159992036?v=4" width="100px;" alt=""/><br /><sub><b> 팀장 : 양재석 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/KR-EGOIST"><img src="https://avatars.githubusercontent.com/u/54177070?v=4" width="100px;" alt=""/><br /><sub><b> 부팀장 : 윤진호 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/pledge24"><img src="https://avatars.githubusercontent.com/u/104922729?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 윤형석 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/znfnfns0365"><img src="https://avatars.githubusercontent.com/u/96744723?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 김동헌 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/jellycreammy"><img src="https://avatars.githubusercontent.com/u/167044663?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 유지원 </b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/wodm15"><img src="https://avatars.githubusercontent.com/u/92417963?v=4" width="100px;" alt=""/><br /><sub><b> 팀원 : 선재영 </b></sub></a><br /></td>
    </tr>
  </tbody>
</table>

## ⚙️ Backend 기술 스택

<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white">
<img src="https://img.shields.io/badge/amazonrds-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white">

## 📃 와이어 프레임

### ![와이어프레임](https://github.com/user-attachments/assets/8d601aa0-0397-44cc-a1e5-a6f56ea08a19)

## 📃 ERD Diagram

### [ERD Diagram]

## 📃 패킷 구조

### [패킷 구조](https://miro.com/app/board/uXjVKwr61VI=/)

## ⚽ 프로젝트 주요 기능

1. **게임 접속**

   - 게임 시작 시 호스트 주소와 포트 번호를 입력합니다.
   - 아이디와 비밀번호를 입력해 회원가입을 합니다.

2. **캐릭터 생성**

   - 회원가입한 후 아이디와 비밀번호를 입력 후 직업을 선택한 다음 로그인 버튼을 누르면 캐릭터 생성 패킷을 서버에 전달합니다.
   - 캐릭터 생성 요청 패킷이 들어오면 playerId, nickname, class, transform, statInfo 데이터를 클라이언트에 전달해 캐릭터가 생성됩니다.

3. **다른 유저 마을에서 이동 동기화**

   - 마을에서 마우스 왼쪽 클릭 시 해당 좌표를 서버에 전달합니다.
   - 서버에서는 전달 받은 좌표값을 세션에서 나를 제외한 나머지 유저에게 전달합니다.
   - 클라이언트에서는 해당 값을 가지고 상대방의 위치 동기화를 합니다.

4. **감정표현 동작 동기화**

   - 마을에서 감정표현 버튼을 누를 시 서버에 해당 버튼 index를 해싱한 값을 전달합니다.
   - 서버에서는 전달받은 해시 값과 playerId를 나를 포함한 다른 유저 모두에게 전달합니다.
   - 클라이언트에서 전달받은 값을 가지고 플레이어의 감정 표현 애니메이션을 실행합니다.

5. **채팅창 동기화**

   - 마을에서 채팅창에 메시지를 입력하고 보내기 버튼을 누를 시 playerId, senderName, chatMsg 값을 서버에 전달합니다.
   - 서버에서는 playerId, chatMsg 값을 나를 포함한 다른 유저 모두에게 전달합니다.
   - 클라이언트에서 전달받은 값을 가지고 채팅창에 채팅 메시지를 보여줍니다.

6. **던전 입장**

   - 마을에서 던전 버튼을 누를 시 4가지의 난이도 버튼이 나타납니다.
   - 버튼을 누르면 해당 버튼의 index를 서버에 전달합니다.
   - 서버에서는 해당 index에 따라 던전의 배경, 몬스터를 다르게 클라이언트에 전달합니다.
   - 던전에 입장하면 입장 씬 화면이 재생되며 입장 씬을 넘기면 전투 화면이 보이게 됩니다.

7. **전투**

   - 플레이어가 첫 턴을 가지게되고 3마리의 몬스터 중 하나를 선택해 공격을 할 수 있습니다.
   - 플레이어가 공격을 한 뒤에는 몬스터가 플레이어를 공격하게 됩니다.
   - 만약 3마리의 몬스터가 살아있으면 3마리의 몬스터가 순서대로 플레이어를 공격합니다.

8. **게임 종료**

   - 게임을 종료 시 서버에서 해당 유저의 playerId를 나를 제외한 접속 중인 모든 유저에게 전달합니다.
   - 클라이언트에서 전달받은 값을 가지고 해당 유저의 오브젝트를 Destory 합니다.
   - 서버에서는 해당 유저를 게임 세션에서 삭제합니다.

## 🚀 추가 구현 기능

1. **파티 시스템**

   - 채팅창에 명령어를 입력하여 파티 생성, 참여, 탈퇴, 초대, 수락, 강퇴 기능을 구현했습니다.
   - '/createTeam' 을 입력 시 파티를 생성할 수 있습니다.
   - '/joinTeam' 을 입력 시 파티에 참여할 수 있습니다.
   - '/leaveTeam' 을 입력 시 파티에 탈퇴할 수 있습니다.
   - '/inviteTeam' 을 입력 시 다른 유저에게 파티 초대를 할 수 있습니다.
   - '/acceptTeam' 을 입력 시 파티 초대를 수락할 수 있습니다.
   - '/kickTeam' 을 입력 시 파티장은 파티원을 강퇴시킬 수 있습니다.

2. **단일 스킬, 광역 스킬**

   - 전투 중 스킬 버튼을 만들었습니다. 스킬 버튼을 누를 시 단일 스킬, 광역 스킬을 선택할 수 있습니다.
   - 단일 스킬을 누를 시 살아있는 몬스터 중 공격할 대상을 선택할 수 있습니다.
   - 단일 스킬을 사용 시 플레이어의 mp를 소모해 플레이어의 magic 능력치 만큼 데미지를 몬스터에게 입힙니다.
   - 광역 스킬을 누를 시 플레이어의 mp를 소모해 플레이어의 magic 능력치 만큼 살아있는 몬스터 모두에게 데미지를 입힙니다.

3. **크리티컬 시스템**

   - 캐릭터 생성 시 기본 크리티컬 확률 5%, 크리티컬 피해량 150% 로 설정했습니다.
   - 전투 중 몬스터에게 공격 시 0 ~ 100 사이의 랜덤한 숫자를 생성해 플레이어 캐릭터의 크리티컬 확률보다 작거나 같으면 데미지 \* (크리티컬 피해량 / 100) 으로 몬스터에게 데미지를 입힙니다.
   - 몬스터마다 크리티컬 확률, 크리티컬 피해량을 설정했습니다.
   - 전투 중 몬스터가 플레이어를 공격 시 0 ~ 100 사이의 랜덤한 숫자를 생성해 몬스터의 크리티컬 확률보다 작거나 같으면 데미지 \* (크리티컬 피해량 / 100) 으로 플레이어에게 데미지를 입힙니다.

4. **회피 시스템**

   - 캐릭터 생성 시 기본 회피율을 5% 로 설정했습니다.
   - 전투 중 몬스터로부터 공격 받을 때 0 ~ 100 사이의 랜덤한 숫자를 생성해 플레이어 캐릭터의 회피율보다 작거나 같으면 몬스터의 데미지를 0 으로 변경해 플레이어 HP에 아무런 영향이 없도록 했습니다.

5. **레벨업 시스템**

   - DB에 레벨 테이블을 생성해 필요 경험치, 상승되는 능력치를 정리했습니다.
   - 던전에서 모든 몬스터를 죽이고 던전이 끝나면 잡은 몬스터의 경험치를 계산해 플레이어의 경험치에 더해줍니다.
   - 만약 레벨업에 필요한 경험치보다 더 많은 경험치를 가지게되면 레벨업 씬이 재생됩니다.
   - 레벨업을 하면 상승되는 능력치를 배틀로그로 볼 수 있습니다.
   - 플레이어 DB 업데이트는 마을로 돌아갈 때 업데이트 됩니다.

6. **골드 시스템**

   - DB에 몬스터마다 얻을 수 있는 골드를 정리했습니다.
   - 던전에서 모든 몬스터를 죽이고 던전이 끝나면 잡은 몬스터의 골드를 계산해 플레이어의 골드에 더해줍니다.
   - 플레이어 DB 업데이트는 마을로 돌아갈 때 업데이트 됩니다.

7. **월드 레벨 시스템**

   - 플레이어의 레벨이 높을수록 던전의 몬스터가 강해지고 많은 경험치와 골드를 획득할 수 있게 했습니다.
   - 월드 레벨은 플레이어 레벨이 5레벨 간격으로 오르게 됩니다.

8. **아이템 드랍 시스템**

   - 던전 입장 시 해당 몬스터로부터 습득할 수 있는 아이템을 DB에서 조회합니다.
   - 모든 몬스터를 잡으면 'A', 'B', 'C' 버튼이 생기는데 해당 버튼을 눌러 아이템을 획득할 수 있습니다.
   - 아이템 획득은 일정 확률에따라 획득할 수 있고, 획득하지 못할 수도 있습니다.

9. **애니메이션 재생**

   - 전투 중 몬스터의 HP가 0 이하가 되면 몬스터가 죽었다는 배틀로그와 함께 몬스터의 사망 애니메이션이 재생되도록 했습니다.
   - 전투 중 플레이어의 HP가 0 이하가 되면 마지막으로 공격한 몬스터의 승리 애니메이션을 재생하고 플레이어는 사망 애니메이션을 재생되도록 했습니다.
