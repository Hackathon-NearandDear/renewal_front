# Near and Dear Frontend

Near and Dear는 NEAR testnet 기반의 커스텀 AI 마켓플레이스 프론트엔드입니다. 사용자는 지갑으로 로그인하고, AI를 탐색하거나 직접 만들고, AI와 채팅하며, 프로필과 보유 잔액을 관리할 수 있습니다.

## 주요 기능

- NEAR Wallet Selector 기반 로그인/회원가입
- 커스텀 AI 생성 및 수정
- 카테고리별 AI 탐색, 오늘의 AI, 주간 트렌드
- AI 검색과 좋아요 처리
- AI 채팅 및 채팅 기록 조회
- 유저 프로필 생성/수정
- NEAR testnet 컨트랙트 연동
- 잔액 조회와 faucet 요청 플로우

## 기술 스택

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- NEAR Wallet Selector
- near-api-js
- SWR
- Zustand
- Jotai
- Radix UI, vaul, lucide-react
- Wagmi/Web3Modal 관련 지갑 패키지

## 프로젝트 구조

```txt
pages/                    Next.js Pages Router
  index.tsx               랜딩 및 지갑 로그인
  explore/                AI 탐색
  search/                 AI 검색
  ai/                     AI 생성 목록, 상세 채팅, 수정
  chat/                   채팅 목록
  mypage/                 내 정보
  mybalance/              잔액
  setprofile/             프로필 생성
  editprofile/            프로필 수정

components/               화면별 컴포넌트와 공통 UI
components/wallet/        NEAR wallet context와 selector
store/                    유저 상태 저장소
utils/api/                백엔드 API 클라이언트
utils/hooks/              AI 모델/목록 로딩 훅
utils/lib/                주소, 날짜, 슬라이더, AI 생성 유틸
styles/                   전역 스타일
```

## 라우트

| Path | 설명 |
| --- | --- |
| `/` | 랜딩, 지갑 로그인, 프로젝트 소개 링크 |
| `/explore` | AI 탐색과 카테고리 필터 |
| `/search` | AI 검색 |
| `/ai` | AI 관련 메인 화면 |
| `/ai/[id]/chat` | 선택한 AI와 채팅 |
| `/ai/[id]/edit` | AI 정보 수정 |
| `/chat` | 사용자 채팅 목록 |
| `/mypage` | 마이페이지 |
| `/mybalance` | 잔액 확인 |
| `/setprofile` | 최초 프로필 설정 |
| `/editprofile` | 프로필 수정 |

## 시작하기

### 1. 의존성 설치

```bash
yarn install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 백엔드 API 주소를 설정합니다.

```env
NEXT_PUBLIC_API_BASE_URL=
```

| 변수 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | 유저, AI, 채팅, 좋아요 API를 호출할 백엔드 서버 주소 |

NEAR 네트워크 설정은 `utils/config.ts`와 `components/wallet/Near.ts`에 정의되어 있습니다. 현재 기본 네트워크는 `testnet`, 컨트랙트 주소는 `neardearrenew6.testnet`입니다.

### 3. 개발 서버 실행

```bash
yarn dev
```

개발 서버는 `http://localhost:5000`에서 실행됩니다.

## 사용 가능한 스크립트

| 명령어 | 설명 |
| --- | --- |
| `yarn dev` | Next.js 개발 서버 실행 |
| `yarn build` | 프로덕션 빌드 |
| `yarn start` | 빌드된 앱 실행 |
| `yarn lint` | Next.js lint 실행 |

## 참고 링크

- 프로젝트 소개: https://blockblock.gitbook.io/nearanddear/
- NEAR testnet faucet: https://near-faucet.io/
