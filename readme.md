# One Punch - One Punch Tower Defence

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

### [와이어프레임]

## 📃 ERD Diagram

### [ERD Diagram]

## 📃 패킷 구조

### [패킷 구조](https://miro.com/app/board/uXjVKwr61VI=/)

## ⚽ 프로젝트 주요 기능

1. **캐릭터 생성**

   - 게임 시작 시 호스트 주소와 포트 번호를 입력합니다.
   - 닉네임과 직업을 선택 후 확인 버튼을 누르면 캐릭터 생성 패킷을 서버에 전달합니다.
   - 캐릭터 생성 요청 패킷이 들어오면 playerId, nickname, class, transform, statInfo 데이터를 클라이언트에 전달해 캐릭터가 생성됩니다.

2. **다른 유저 마을에서 이동 동기화**

   - 마을에서 마우스 왼쪽 클릭 시 해당 좌표를 서버에 전달합니다.
   - 서버에서는 전달 받은 좌표값과 playerId를 나를 제외한 나머지 유저에게 전달합니다.
   - 클라이언트에서는 해당 값을 가지고 위치 동기화를 합니다.

3. **감정표현 동작 동기화**

   - 마을에서 감정표현 버튼을 누를 시 서버에 해당 버튼 index를 전달합니다.
   - 서버에서는 전달받은 버튼 값과 playerId를 나를 포함한 다른 유저 모두에게 전달합니다.
   - 클라이언트에서 전달받은 값을 가지고 플레이어의 감정 표현 애니메이션을 실행합니다.

4. **채팅창 동기화**

   - 마을에서 채팅창에 메시지를 입력하고 보내기 버튼을 누를 시 playerId, senderName, chatMsg 값을 서버에 전달합니다.
   - 서버에서는 playerId, chatMsg 값을 나를 포함한 다른 유저 모두에게 전달합니다.
   - 클라이언트에서 전달받은 값을 가지고 채팅창에 채팅 메시지를 보여줍니다.

5. **던전 입장**

   - 마을에서 던전 버튼을 누를 시 4가지의 난이도 버튼이 나타납니다.
   - 버튼을 누르면 해당 버튼의 index를 서버에 전달합니다.
   - 서버에서는 해당 index에 따라 던전의 배경, 몬스터를 다르게 클라이언트에 전달합니다.
   - 던전에 입장하면 입장 씬 화면이 재생되며 입장 씬을 넘기면 전투 화면이 보이게 됩니다.

6. **게임 종료**

   - 게임을 종료 시 서버에서 해당 유저의 playerId를 나를 제외한 접속 중인 모든 유저에게 전달합니다.
   - 클라이언트에서 전달받은 값을 가지고 해당 유저의 오브젝트를 Destory 합니다.
   - 서버에서는 해당 유저를 게임 세션에서 삭제합니다.

7. **전투**

## 🚀 추가 구현 기능
