<div align="middle">
  <img width="200px;" src="/public/images/logo.svg"/>
</div>
<h1 align="middle">Online-auction</h1>
<h3 align="middle">온라인 중고 물품 경매 웹 서비스</h3>
<br />

# ❗프로젝트 배포

### 🎥 배포 사이트

<!-- 온라인 경매 시스템 -->
<!-- 리액트 & 파이어베이스를 이용한 개인 프로젝트 -->

- 배포 URL : [https://online-auction-2bf8a.web.app/](https://online-auction-2bf8a.web.app/)
- Test ID : f@f.com / n@n.com
- Test PW : 123456

<br />

# 📃 프로젝트 정보

### 1. 주제

- 온라인 경매 서비스
  - 온라인 상에 중고물품을 올려 경매를 진행하는 웹서비스
  - 초기 mock 서버로 json-server를 사용했으나, 제한된 데이터 구조와 배포 후 수정 불가 문제로 인해 실시간 연동과 배포 환경에 적합한 `Firebase`로 전환
  - 비동기 데이터 관리를 효율적으로 처리하기 위해 `React Query`를 도입해 데이터 캐싱 및 상태 관리를 최적화
  - `zustand` 를 활용해 전역 상태 관리를 단순화하고, 코드 가독성과 성능을 개선

### 2. 제작 기간

- 1차: json-server 사용

  - 2025.01.10 ~ 03.24

- 2차: 프로젝트 마이그레이션(`Firebase` & `React Query`)

  - 2025.03.24 ~ 05.11

### 3. 프로젝트 구조

<details>
<summary>프로젝트 구조 펼쳐보기</summary>
<div markdown="1" style="padding-left: 15px;">

```
├── README.md
├── index.html
├── eslint.config.js
├── .gitignore
├── vite.config.ts
├── package.json
├── yarn.lock
├── firebase.json
├── .firebaserc
│
├── public
│    └── images/...
└── src
  ├── main.tsx
  ├── App.tsx
  ├── index.css
  ├── apis/libs
  │     └── index.ts
  │     └── auction.ts
  │     └── home.ts
  │     └── mypage.ts
  ├── stores
  │     └── useAuthStore.ts
  ├── components
  │     ├── common
  │     │     ├── CommonButton.tsx
  │     │     ├── CommonInput.tsx
  │     │     .
  │     │     .
  │     │     .
  │     │     └── CommonModal.tsx
  │     ├── pages
  │     │     └── mypage
  │     │            └── MypageList.tsx
  │     └── UI
  │           ├── DataLoading.tsx
  │           ├── Loading.tsx
  │           └── Logo.tsx
  ├── constants
  │     ├── firebase.ts
  │     ├── category.ts
  │     └── mypage.ts
  ├── libs
  │     ├── firebase.ts
  │     └── queryClient.ts
  ├── utils
  │     └── index.ts
  ├── pages
  │     ├── Home.tsx
  │     ├── login
  │     │     ├── Login.tsx
  │     │     └── Register.tsx
  │     ├── auction
  │     │     ├── Detail.tsx
  │     │     ├── List.tsx
  │     │     └── SellerItems.tsx
  │     ├── mypage
  │     │     ├── Mypage.tsx
  │     │     ├── MySellList.tsx
  │     │     ├── MyBidList.tsx
  │     │     ├── MyBidAward.tsx
  │     │     └── MyFavoriteList.tsx
  │     ├── sell
  │     │     ├── Sell.tsx
  │     │     └── Edit.tsx
  │     ├── services
  │     │     ├── Services.tsx
  │     │     ├── Notice.tsx
  │     │     └── Faq.tsx
  │     ├── guide
  │     │     └── Guide.tsx
  │     └── NotFound.tsx
  ├── types
  │     ├── index.ts
  │     ├── component.ts
  │     ├── user.ts
  │     ├── post.ts
  │     └── style.jsx
  ├── styles
  │     ├── AppStyle.tsx
  │     ├── CommonStyle.tsx
  │     ├── LoginStyle.tsx
  │     ├── HomeStyle.tsx
  │     ├── AuctionStyle.tsx
  │     ├── MypageStyle.tsx
  │     ├── SellPageStyle.tsx
  │     └── ServiceStyle.tsx
  └── dev-only
        └── dev-only code
```

</div>
</details>

### 4. 사용 기술

##### \* Front-end

<!-- react, typescript, javascript, zustand, axios -->
<div>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
  <img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=black">
  <img src="https://img.shields.io/badge/zustand-000000?style=for-the-badge&logo=circle&logoColor=white">
  <img src="https://img.shields.io/badge/react%20query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white">
  <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
</div>

  <br />

<!-- styled-component, html, css -->
<div>
  <img src="https://img.shields.io/badge/styled%20components-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white">
  <img src="https://img.shields.io/badge/Html-E34F26?style=for-the-badge&logo=Html5&logoColor=white">
  <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
</div>

##### \* Back-end

<!-- firebase, json-server -->
<div>
  <img src="https://img.shields.io/badge/firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white">
  <img src="https://img.shields.io/badge/json%20server-000000?style=for-the-badge&logo=json&logoColor=white">
</div>

##### \* Config

<!-- vite, yarn -->
<div>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white">
  <img src="https://img.shields.io/badge/yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white">
</div>

##### \* 협업 도구

<!-- git, github, notion -->
<div>
  <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
  <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
  <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">
</div>

<br />

# 🔑 핵심 기능

<!-- 홈화면, 로그인&회원가입, 마이페이지, 리스트, 게시글 등록, 디테일 페이지 -->

### 메인 페이지

<details>
<summary>카테고리 별 게시글 검색, 최근 게시글, 좋아요 순 게시글, 서비스 설명 페이지 이동</summary>
<div markdown="1" style="padding-left: 15px;">
  <img width="383" alt="image" src="https://github.com/user-attachments/assets/65936dea-7d15-4183-9285-d6e3292f9517" />
</div>
</details>

### 네비게이션 메뉴

<details>
<summary>네비게이션 메뉴(로그인 여부 구분)</summary>
<div markdown="1" style="padding-left: 15px;">

<br />

- 로그인 상태: mypage 메뉴 보임
  <img width="475" alt="image" src="https://github.com/user-attachments/assets/1e30339b-4e76-4a88-883a-eb4f23b27df1" />

<br />

- 로그아웃 상태: mypage 메뉴 사라짐
  <img width="479" alt="image" src="https://github.com/user-attachments/assets/82dbec3d-89f9-4f26-846f-2e54db03c645" />

<br />
</div>
</details>

### 로그인&회원가입

<details>
<summary>로그인 및 회원가입 페이지</summary>
<div markdown="1" style="padding-left: 15px;">

  <img width="473" alt="image" src="https://github.com/user-attachments/assets/eea09407-df93-4769-a48f-63b457914dbb" />

  <img width="472" alt="image" src="https://github.com/user-attachments/assets/b6c455b9-eacd-4b50-8a3a-24ff4bdd9a1c" />

</div>
</details>

### 마이페이지

<details>
<summary>로그아웃, 나의 등록 게시글, 나의 입찰&낙찰 내역, 나의 좋아요 리스트</summary>
<div markdown="1" style="padding-left: 15px;">

<br />

- 마이페이지 화면
  <img width="320" alt="image" src="https://github.com/user-attachments/assets/8b973a24-d11b-4610-8d11-0258ff991265" />

- 각 항목 별 더 보기 페이지: 무한스크롤 구현
  <img width="386" alt="image" src="https://github.com/user-attachments/assets/76858720-6639-45c3-8a7b-06594f56cbfc" />

- 나의 등록 게시글: 해당 게시글의 마감 여부 구분 가능
- 나의 낙찰 내역, 나의 좋아요 리스트: 게시글 확인
      <details>
        <summary>나의 입찰 내역: 각 게시글 클릭 시 나의 입찰 기록 확인 가능</summary>
        <div markdown="1" style="padding-left: 15px;">
        <img width="449" alt="image" src="https://github.com/user-attachments/assets/6fdbe92f-f383-466b-be1d-b6ef54cca2d7" />
        </div>
      </details>

</div>
</details>

### 게시글 리스트

<details>
<summary>경매 출품 목록, 조건부 검색 가능, 무한스크롤 구현</summary>
<div markdown="1" style="padding-left: 15px;">
  <img width="263" alt="image" src="https://github.com/user-attachments/assets/753cfac3-2a20-40f2-801b-d6e9a299368f" />
</div>
</details>

### 게시글 상세 페이지

<details>
<summary>좋아요 기능, 입찰하기 | 낙찰 처리, 게시글 수정&삭제</summary>
<div markdown="1" style="padding-left: 15px;">

- 게시글 작성자: 좋아요 비활성화, 수정&삭제 버튼 활성화, 낙찰 처리 버튼 활성화
        <details>
        <summary>이미지 보기</summary>
        <div markdown="1" style="padding-left: 15px;">
          <img width="263" alt="image" src="https://github.com/user-attachments/assets/6712353a-bf20-409e-9224-143b91b2a956" />
        </div>
        </details>

- 일반 사용자: 입찰 금액 입력, 좋아요 활성화
        <details>
        <summary>이미지 보기</summary>
        <div markdown="1" style="padding-left: 15px;">
          <img width="263" alt="image" src="https://github.com/user-attachments/assets/83863df2-9655-449b-95cd-d0662790bb5f" />
        </div>
        </details>

</div>
</details>

<br />

# 📕 작업 내용

- [[문서보기] 프로젝트 기획](https://github.com/vitaZ-dev/online-auction/wiki/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EA%B8%B0%ED%9A%8D)
- [[문서보기] 커스텀 컴포넌트 정리 문서](https://github.com/vitaZ-dev/online-auction/wiki/%EA%B3%B5%ED%86%B5-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%EB%AC%B8%EC%84%9C)

<br />

# ✨ 추가 개선 목표

- 게시글 낙찰 후 시스템 구축
- 로그인 시 토큰 다루기
- 간편 로그인 기능 추가
- 회원 정보 찾기 및 회원 정보 수정 기능 추가
- 무한스크롤 데이터 호출 부분 코드 로직 분리
- 무한스크롤 리액트쿼리 적용
- `i18n` 다국어 기능 구현하기
- FAQ 및 공지사항 페이지 추가 기획 및 구현
- 관리자 페이지 추가 기획 및 구현

# 😊 About Me

- [Notion 이력서 페이지로 이동](https://www.notion.so/Custom-Component-19a90b03460a80bca2f3e336e5b31a3c)
- [GitHub 페이지로 이동](https://github.com/vitaZ-dev)
