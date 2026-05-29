# 부적 발급 앱 MVP 설계서

## 1) 제품 개요
- 제품명(가칭): `부적발급소`
- 핵심 가치: 상황별 밈 부적을 뽑고 강화/파괴 결과를 친구와 공유하는 초단기 소셜 엔터테인먼트
- 타깃: 20~30대 모바일 사용자, 특히 직장인/대학생 중심의 밈 소비층
- 포지셔닝: 점술 앱이 아니라 "유머형 수집/강화 게임"

### 문제 정의
- 스트레스 상황에서 가볍게 웃고 공유할 콘텐츠가 부족함
- 짧은 시간에 성취/실패 감정을 주는 캐주얼 루프 수요가 큼

### 해결 전략
- 상황 공감형 문구를 가진 부적 카드 제공
- 강화 성공/실패 연출로 감정 곡선 극대화
- 결과 카드 자동 생성으로 SNS 인증 유도

## 2) MVP 목표와 성공 지표
### MVP 목표
- 1분 내 첫 뽑기와 첫 강화를 경험하게 만들기
- 공유 가능한 결과 카드 생성률 높이기
- 재방문 동기(무료 뽑기, 주간 챌린지) 확보

### 핵심 KPI
- `Activation`: 가입 후 24시간 내 뽑기 1회 이상 비율 60%+
- `Core Action`: 뽑기 사용자 중 강화 버튼 클릭 비율 70%+
- `Virality`: 강화 시도 중 공유 수행 비율 25%+
- `Retention`: D1 30%+, D7 12%+ (초기 목표)

## 3) 콘텐츠 카테고리 및 예시
### 직장인 전용
- 팀장님 기억상실 부적
- 월급 루팡 무죄 부적
- 카톡 퇴근 시급 부적

### 일상/생활 전용
- 지하철 앞자리 빌런 퇴치 부적
- 알고리즘 중독 탈출 부적
- 다이어트 내일부터 부적

### 연애/친목 전용
- 눈치 챙겨 부적
- 안읽씹 차단 부적
- 고백 공격 방어 부적

## 4) 사용자 플로우
1. 온보딩 진입
2. 닉네임 생성 후 홈 이동
3. 무료 뽑기 또는 티켓 사용 뽑기
4. 부적 결과 확인 (등급/효과 수치/문구)
5. `강화하기` 반복 시도
6. 성공 시 +수치 상승, 실패 시 파괴 연출
7. 결과 카드 생성 및 공유
8. 랭킹/친구 대결 확인

## 5) 화면 설계
### A. 온보딩
- 앱 컨셉 3컷 안내
- 닉네임 입력
- 약관 동의(오락용 콘텐츠 고지 포함)

### B. 홈
- 오늘의 무료 뽑기 버튼
- 보유 부적 리스트
- 현재 진행 중 대결 카드
- 주간 랭킹 진입 버튼

### C. 뽑기 결과
- 부적 이름
- 카테고리 태그
- 초기 강화 수치(`+0`)
- 희귀도(일반/희귀/전설)
- 다음 행동: `강화하기`, `보관`, `공유`

### D. 강화 화면
- 현재 부적 미리보기
- 현재 단계 성공 확률
- 강화 비용/소모 아이템 표시
- CTA: `강화하기`
- 보조 CTA: `안전강화권 사용`

### E. 강화 결과 모달
- 성공: 번개/봉인문 빛 연출 + 단계 상승
- 실패(비파괴): 단계 하락 또는 유지
- 실패(파괴): 카드 찢김/재 연출 + 위로 보상 노출

### F. 공유 카드 생성 화면
- 큰 타이포: `+9 강화 월요병 파괴 부적`
- 결과 배지: 성공/파괴
- 자동 카피 한 줄
- 공유 타깃: 카카오톡, 인스타 스토리, 링크 복사

### G. 랭킹/대결
- 주간 최고 강화 순위
- 주간 최다 파괴 순위(밈 포지션)
- 친구 1:1 대결 결과

## 6) 강화 시스템 상세 설계
###+ 강화 단계와 명칭
- 기본: `+0 월요병 퇴치 부적`
- 강화 예시: `+1 강화 월요병 퇴치 부적` -> `+9 강화 월요병 파괴 부적`

### 성공 확률(기본)
- +0 -> +1: 90%
- +1 -> +2: 75%
- +2 -> +3: 60%
- +3 -> +4: 45%
- +4 -> +5: 30%
- +5 -> +6: 20%
- +6 -> +7: 12%
- +7 -> +8: 7%
- +8 -> +9: 3%

### 실패 처리 규칙
- +0~+3 구간: 실패 시 단계 유지
- +4~+6 구간: 실패 시 1단계 하락
- +7~+9 구간: 실패 시 파괴 확률 적용
- 기본 파괴 확률(실패 시): +7(35%), +8(50%), +9 도전(65%)

### 보조 아이템(초기 2종)
- 안전강화권: 실패 시 파괴 면제, 대신 1단계 하락
- 배수강화권: 성공 시 +2, 실패 시 즉시 파괴

### 파괴 보상(좌절 완화)
- 파괴 시 `재의 조각` 지급
- 조각 누적으로 랜덤 부적 재뽑기 가능

## 7) 소셜/바이럴 설계
### 공유 카드 자동 카피
- "{닉네임}님이 +8에서 터졌습니다. 다시 갑니다."
- "{닉네임}님, 오늘 월요병 파괴 성공"

### 공유 포인트
- 강화 성공 시
- 파괴 시 (실패도 콘텐츠화)
- 주간 랭킹 진입 시

### 친구 대결 모드
- 동일 시작 부적 지급
- 24시간 내 최고 강화 수치 비교
- 동률 시 먼저 달성한 사용자가 승리

## 8) 데이터 모델(초안)
### `users`
- id (uuid)
- nickname (string, unique)
- created_at (datetime)

### `talismans`
- id (uuid)
- category (enum: office, life, relationship)
- base_name (string)
- final_name_template (string)
- rarity (enum: common, rare, legendary)
- created_at (datetime)

### `user_talismans`
- id (uuid)
- user_id (fk)
- talisman_id (fk)
- level (int, 0~9)
- status (enum: active, broken, archived)
- obtained_at (datetime)
- broken_at (datetime nullable)

### `enhancement_logs`
- id (uuid)
- user_talisman_id (fk)
- from_level (int)
- to_level (int)
- success (bool)
- destroyed (bool)
- option_used (enum: none, safe_ticket, double_ticket)
- created_at (datetime)

### `duels`
- id (uuid)
- challenger_user_id (fk)
- opponent_user_id (fk)
- seed_talisman_id (fk)
- challenger_best_level (int)
- opponent_best_level (int)
- winner_user_id (fk nullable)
- started_at (datetime)
- ended_at (datetime)

## 9) API 설계(초안)
### 인증/유저
- `POST /auth/guest-login`
- `POST /users/profile`

### 부적/강화
- `POST /talismans/draw`
- `POST /user-talismans/{id}/enhance`
- `POST /user-talismans/{id}/enhance-with-item`
- `GET /user-talismans`

### 공유/랭킹/대결
- `POST /share-cards/generate`
- `GET /rankings/weekly`
- `POST /duels`
- `POST /duels/{id}/attempt`
- `GET /duels/{id}`

## 10) 정책 및 안전 가이드
### 필수 고지
- "본 서비스는 재미를 위한 콘텐츠이며 실제 효능을 보장하지 않습니다."
- 확률형 강화의 성공/실패 확률은 상세 화면에서 상시 공개

### 콘텐츠 필터링
- 실명/회사명/집단 비방 문구 제한
- 혐오/차별/폭력 조장 문구 금지

### 연령/결제
- 청소년 결제 보호 정책 준수
- 리워드 광고 및 인앱 결제의 사용 목적 명시

## 11) 기술 스택 제안(MVP)
- 클라이언트: React Native (Expo)
- 서버: Node.js + NestJS
- DB: PostgreSQL
- 캐시/랭킹: Redis
- 인증: 익명 로그인 + 소셜 로그인 확장 가능
- 배포: Vercel(웹 랜딩) + Render/Fly(백엔드)

## 12) 이벤트/로그 설계
- `onboarding_completed`
- `talisman_drawn`
- `enhancement_attempted`
- `enhancement_succeeded`
- `enhancement_failed`
- `talisman_destroyed`
- `share_card_generated`
- `share_clicked`
- `duel_created`
- `duel_finished`

## 13) 2주 MVP 개발 계획
### 1주차
- 디자인 시스템 최소셋 구축
- 유저/뽑기/강화 API 구현
- 강화 연출 1차(성공/실패/파괴)

### 2주차
- 공유 카드 생성
- 랭킹/대결 최소 버전
- 이벤트 로깅 및 지표 대시보드
- QA 및 정책 문구 정비

## 14) 출시 후 우선 실험 항목
- 실험 A: 무료 뽑기 횟수(1회 vs 2회)
- 실험 B: +7 이상 파괴 확률 완급 조정
- 실험 C: 공유 카드 카피 톤(도발형 vs 귀여움형)
- 실험 D: 파괴 보상량에 따른 재시도율 변화

## 15) 초기 범위에서 제외(Out of Scope)
- 실시간 길드/채팅
- 블록체인/NFT 요소
- 과도한 경제 시스템(거래소, 경매장)
- 복잡한 PVP 시즌 매칭
