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

<a target="_blank" href="https://mylittletrip-4416.web.app">> 배포 페이지 이동</a>
[> 배포 페이지 이동](https://mylittletrip-4416.web.app){:target="\_blank"}

- 배포 URL : [https://mylittletrip-4416.web.app](https://mylittletrip-4416.web.app){:target="\_blank"}
- Test ID : f@f.com | n@n.com
- Test PW : 123456

<br />

# 📃 프로젝트 정보

### 1. 주제

> - 온라인 경매 서비스
>   - 온라인 상에 중고물품을 올려 경매를 진행하는 서비스.
>   - 다른 유저의 중고 물품에 입찰을 올릴 수 있다.

### 2. 제작 기간

> - 1차: json-server 사용
>   - 2025.01.10 ~ 03.24

> - 2차: 프로젝트 마이그레이션(파이어베이스 & 리액트 쿼리)
>   - 2025.03.24 ~ 05.11

### 3. 프로젝트 구조

<details>
<summary>프로젝트 구조</summary>
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
  │     └── UI
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

<!-- react, typescript, vite, javascript, zustand, axios -->
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
  <img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=Typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white">
  <img src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=black">
  <img src="https://img.shields.io/badge/zustand-000000?style=for-the-badge&logo=circle&logoColor=white">
  <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">

  <br />

<!-- styled-component, html, css -->
  <img src="https://img.shields.io/badge/styled%20components-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white">
  <img src="https://img.shields.io/badge/Html-E34F26?style=for-the-badge&logo=Html5&logoColor=white">
  <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">

##### \* Back-end

<!-- firebase, json-server -->
  <img src="https://img.shields.io/badge/firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white">
  <img src="https://img.shields.io/badge/json%20server-000000?style=for-the-badge&logo=json&logoColor=white">

##### \* 협업 도구

<!-- git, github, notion -->
  <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
  <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
  <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">

<br />

# 🔑 핵심 기능

<!-- 홈화면, 로그인&회원가입, 마이페이지, 리스트, 게시글 등록, 디테일 페이지 -->

##### 메인 페이지

<details>
<summary>카테고리 별 게시글 검색, 최근 게시글, 좋아요 순 게시글, 서비스 설명 페이지 이동</summary>
<div markdown="1" style="padding-left: 15px;">
img
</div>
</details>

##### 네비게이션 메뉴

<details>
<summary>네비게이션 메뉴(로그인 여부 구분)</summary>
<div markdown="1" style="padding-left: 15px;">
img
</div>
</details>

##### 로그인&회원가입

<details>
<summary>로그인 및 회원가입 페이지</summary>
<div markdown="1" style="padding-left: 15px;">
img
</div>
</details>

##### 마이페이지

<details>
<summary>로그아웃, 나의 등록 게시글, 나의 입찰&낙찰 내역, 나의 좋아요 리스트</summary>
<div markdown="1" style="padding-left: 15px;">
img
</div>
</details>

##### 게시글 리스트

<details>
<summary>경매 출품 목록, 조건부 검색 가능</summary>
<div markdown="1" style="padding-left: 15px;">
img
</div>
</details>

##### 게시글 상세 페이지

<details>
<summary>좋아요 기능, 입찰하기 | 낙찰 처리, 게시글 수정&삭제</summary>
<div markdown="1" style="padding-left: 15px;">
img
</div>
</details>

<br />

# 📕 작업 내용

- 기획 (문서보기)
- 커스텀 컴포넌트 제작 (문서보기)

<br />

# ✨ 트러블 슈팅

<br />

# ✨ 추가 개선 목표

- 게시글 낙찰 후 시스템 구축
- 로그인 시 토큰 다루기
- 간편 로그인 기능 추가
- 무한스크롤 리액트쿼리 적용
