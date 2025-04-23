## ✨ 프로젝트 소개

![image](https://github.com/user-attachments/assets/a56168f7-9ef2-49b0-abc7-b47f9d509a76)

> **음악 영상 공유 SNS 플랫폼 개발**

Re:Play는 영상 링크 기반 플레이리스트를 만들고, 공유하고, 구독하여 자신만의 타임라인을 만들고 네트워킹 할 수 있는 SNS형 웹 애플리케이션입니다.

<br>

## ⏰ 프로젝트 일정

> 기획 / 디자인 : 2025년 3월 26일 ~ 4월 2일 (1주) <br>
> 개발 : 2025년 4월 3일 ~ 4월 18일 (3주) <br>
> 리팩토링 : 2025년 4월 21일 ~ 4월 23일 (3일)

<br>

## 🤓 팀원 소개

<div align="center">

| <img width="200px" src="https://avatars.githubusercontent.com/u/173143133?v=4" style="max-width: 100%;"> | <img width="200px" src="https://avatars.githubusercontent.com/u/118454010?v=4" style="max-width: 100%;"> | <img width="200px" src="https://avatars.githubusercontent.com/u/81246338?v=4" style="max-width: 100%;"> | <img width="200px" src="https://avatars.githubusercontent.com/u/38741900?v=4" style="max-width: 100%;"> |
| :------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------: |
|                          **[장은혜(Frontend)](https://github.com/Jang-eunhye)**                          |                            **[이지선(Frontend)](https://github.com/ijisun)**                             |                           **[임하림(Frontend)](https://github.com/gkfla668)**                           |                           **[박현아(Frontend)](https://github.com/pha1155)**                            |
|                             로그인 / 회원가입<br/> 플레이리스트 목록 페이지                              |                            구독 / 좋아요 기능 <br/> 플레이리스트 상세 페이지                             |                             댓글 기능 <br/> 플레이리스트 생성 / 수정 페이지                             |                                    마이 페이지<br/> 정보 수정 페이지                                    |

</div>

<br>

## 🚀 페이지 소개 및 주요 기능

### 1. 로그인 / 회원가입 (Login / Signup)

- Supabase의 Auth 기능을 활용해 구현된 인증 페이지
- 이메일 기반 로그인 및 회원가입 기능 제공
- 인증에 성공하면 자동으로 액세스 토큰이 저장되며, 이후 페이지 접근 권한에 활용

<div align="center">
  <img width="300px" src="https://github.com/user-attachments/assets/3fd39134-4e15-4162-a339-ccec6ec77470">
  <img width="300px" src="https://github.com/user-attachments/assets/a156b3be-3289-4dca-872d-dfb28c5d5094">
</div>

<br>

### 2. 추천 플레이리스트 (Home)

- 구독 수가 많은 순으로 정렬된 플레이리스트 목록 제공
- 각 플레이리스트는 카드 형태로 시각화
- 키워드 검색 기능을 통해 원하는 플레이리스트를 쉽게 검색 가능
- 무한 스크롤을 적용해 자연스럽게 목록 탐색

<div align="center">
  <img width="300px" src="https://github.com/user-attachments/assets/8a02ef2a-2ae0-4aec-b22e-5e001a6127c5">
</div>

<br>

### 3. 구독 플레이리스트 (Subscriptions)

- 사용자가 구독한 플레이리스트 목록을 카드 형태로 시각화
- 업데이트 순으로 정렬되어, 최신 콘텐츠 확인 가능
- 키워드 검색 기능과 무한 스크롤을 통해 효율적인 탐색 가능

<div align="center">
  <img width="300px" src="https://github.com/user-attachments/assets/3d4c4ec8-783c-4a91-b608-2a94602c4d61">
</div>

<br>

### 4. 플레이리스트 상세 (PlaylistDetail)

- 선택한 플레이리스트의 상세 내용을 확인하고 영상 콘텐츠를 감상할 수 있는 페이지
- 페이지 상단에 위치한 영상 플레이어를 통해 플레이리스트에 포함된 영상들을 순차적으로 재생하거나 개별 선택하여 감상
- 플레이리스트의 제목, 소개글 그리고 작성자의 정보 표시
- 작성자의 프로필 이미지 또는 닉네임 클릭 시 해당 유저의 마이페이지로 이동
- 좋아요 & 구독 버튼 클릭으로 상태를 변경할 수 있고, supabase에 실시간으로 데이터 반영
- 하단의 댓글 입력창을 통해 감상 소감 자유롭게 작성 가능

<div align="center">
  <img width="300px" src="https://github.com/user-attachments/assets/40cc0665-3b64-45c0-b77d-08237dbedd82">
</div>

<br>

### 5. 플레이리스트 생성/수정 (PlaylistCreate)

- 제목, 소개글, 링크를 통해 유튜브 영상을 등록하여 나만의 플레이리스트 생성
- 토글 스위치를 통해 플레이리스트이 공개/비공개 여부 설정
- 유튜브 영상의 oEmbed API를 활용해 유튜브 영상 URL만으로 제목과 썸네일 이미지를 불러오는 비동기 함수 구현
- 영상은 한 개 이상 등록해야 생성 가능

<div align="center">
  <img width="300px" src="https://github.com/user-attachments/assets/458ac523-d1c0-4a2f-bed4-ed84ae409c7d">
  <img width="300px" src="https://github.com/user-attachments/assets/15c9a951-6a9b-4cbb-9161-896fa3a5aa46">
</div>

<br>

### 6. 마이 페이지 (MyPage)

- 로그인한 유저의 프로필 이미지, 닉네임, 소개글을 Supabase user 테이블로부터 조회
- 유저가 등록한 플레이리스트 목록을 무한 스크롤 기반으로 fetch
- 최신 업데이트 순(기본), 구독순, 좋아요순 필터링 지원
- Header 메뉴 내 로그아웃 기능 구현 (세션 종료 처리 포함)

<div align="center">
  <img width="300px" src="https://github.com/user-attachments/assets/2febca8f-5be1-4659-8325-67b1cfa8cf1d">
</div>

<br>

### 7. 정보 수정 (EditProfile)

- 프로필 이미지, 닉네임, 비밀번호, 소개글 수정 기능 제공
- 변경 사항은 Supabase에 반영되며, 마이 페이지에서 실시간 반영 확인 가능
- 프로필 이미지는 Supabase Storage에 업로드 및 경로 저장
- 닉네임 입력 시 중복 여부 확인 API 연동
- 비밀번호 변경 시 비밀번호 확인을 통한 유효성 검사 수행

<div align="center">
  <img width="300px" src="https://github.com/user-attachments/assets/96f259c9-3611-41f1-81c4-50ecfa028b7f">
</div>

<br>

## 🔨 기술 스택

<h3>Frontend</h3>
<div align="left">
  <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/zustand-orange?style=for-the-badge&logo=zustand&logoColor=white">
  <img src="https://img.shields.io/badge/Tanstack Query-FF4154?style=for-the-badge&logo=TanstackQuery&logoColor=white">
</div>

<h3>Build</h3>
<div align="left">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white">
</div>

<h3>UI & Styling</h3>
<div align="left">
  <img src="https://img.shields.io/badge/shadcn/ui-white?style=for-the-badge&logo=none&logoColor=black">
  <img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
</div>

<h3>Backend</h3>
<div align="left">
  <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white">
</div>

<h3>Testing</h3>
<div align="left">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white">
</div>

<h3>Tools</h3>
<div align="left">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white">
  <img src="https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white">
  <img src="https://img.shields.io/badge/Zoom-2D8CFF?style=for-the-badge&logo=Zoom&logoColor=white">
  <img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white">
  <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white">
</div>

<br>

## 🧱 폴더 구조

```
💚 src
 ┣ 📁 assets
 ┃ ┣ 📁 icons
 ┃ ┗ 📁 imgs
 ┣ ⭐️ components
 ┃ ┣ 📁 common
 ┃ ┣ 📁 myPage
 ┃ ┣ 📁 playlistCreate
 ┃ ┣ 📁 playlistDetail
 ┃ ┗ 📁 constants
 ┣ 📁 hooks
 ┣ 📁 layout
 ┣ 📚 pages
 ┣ 📁 routes
 ┣ 📁 services
 ┃ ┣ 📁 axios
 ┃ ┗ 📁 supabase
 ┣ 🧰 store
 ┣ 📁 styles
 ┣ 📁 types
 ┣ 📁 utils
 ┣ 📄 App.tsx
 ┗ 📄 main.tsx
📁 tests

```

<br>

## 🎮 프로젝트 실행 방법

1. 프로젝트 clone <br>
   `git clone https://github.com/Dev-FE-3/toy-project3-team2.git`

2. `.env` 파일 설정 <br>
   API 키를 안전하게 보관하기 위해 `.env` 파일을 생성하고, 필요한 환경 변수를 설정합니다.

3. 패키지 설치 <br>
   `npm install`

4. 프로젝트 실행 <br>
   `npm run dev`

<br>

## ⚡ 브랜치 전략

### 1. 브랜치 종류

| 브랜치명        | 설명                                   |
| --------------- | -------------------------------------- |
| `main`          | 제품의 안정적인 배포를 위한 브랜치     |
| `dev`           | 개발 브랜치로, 모든 기능이 병합되는 곳 |
| `feat/[기능명]` | 기능 개발을 위한 개별 브랜치           |

### 2. 브랜치 흐름

| 대상 브랜치             | Merge 방식                          |
| ----------------------- | ----------------------------------- |
| `feat/[기능명]` → `dev` | **Squash Merge** (커밋 내역 정리)   |
| `dev` → `main`          | **Merge** (Squash 적용된 내용 유지) |

### 3. 브랜치 운영 방식

1. **기능 개발**: `feat/[기능명]`에서 작업 후 `dev` 브랜치로 `Squash Merge`
2. **개발 완료 후 배포**: `dev`에서 안정적인 상태가 되면 `main`으로 `Merge`
3. **Squash Merge 적용 이유**: 기능 단위로 커밋을 정리하여 `dev` 브랜치를 깔끔하게 유지

<br>

## 🤙 커밋 컨벤션

```
#   Feat        : 기능 (새로운 기능)
#   Fix         : 버그 (버그 수정)
#   Refactor    : 리팩토링
#   Design      : CSS 등 사용자 UI 디자인 변경
#   Comment     : 필요한 주석 추가 및 변경
#   Style       : 스타일 (코드 형식, 세미콜론 추가: 비즈니스 로직에 변경 없음)
#   Docs        : 문서 수정 (문서 추가, 수정, 삭제, README)
#   Test        : 테스트 (테스트 코드 추가, 수정, 삭제: 비즈니스 로직에 변경 없음)
#   Chore       : 기타 변경사항 (빌드 스크립트 수정, assets, 패키지 매니저 등)
#   Init        : 초기 생성
#   Rename      : 파일 혹은 폴더명을 수정하거나 옮기는 작업만 한 경우
#   Remove      : 파일을 삭제하는 작업만 수행한 경우
```

<br>

## 🤙 네이밍 컨벤션

```
- 변수: camelCase
- 상수: SNAKE_CASE (대문자)
- 함수: camelCase, 동사로 시작 ex) onClick
- 컴포넌트: arrow function
- 포멧터: Prettier / ESLint
```
