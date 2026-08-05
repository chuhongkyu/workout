# 오운완 · 운동 기록 앱

하루하루 운동을 기록하고, 최근 운동 밸런스를 바탕으로 오늘 뭘 하면 좋을지 추천받는 모바일 우선 웹앱.

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **당근 seed-design** 디자인 토큰/컴포넌트 (`@seed-design/react`, `@seed-design/css`) + 모노크롬 아이콘 (`@karrotmarket/react-monochrome-icon`)
- **Supabase** (Postgres + 이메일 매직링크 인증) — 여러 기기 동기화, `localStorage`는 오프라인 캐시
- **dnd-kit** 드래그앤드롭 정렬
- 스타일: SCSS Module + `classnames/bind`, seed 디자인 토큰(CSS 변수) 기반

## 주요 기능

- **이메일 매직링크 로그인** → 같은 이메일로 로그인하면 폰·PC 어디서든 기록 유지
- 로그인 후 최초 1회 **이름 온보딩**
- 운동 기록: **운동명 · 부위(하체/상체/코어/유산소) · 세트 · 반복 · 무게(kg) · 날짜(KST)**
- **날짜별 그룹** + 아코디언(날짜 클릭 시 상세 리스트 펼침, 최신 날짜는 기본 펼침)
- 기록 **추가 / 삭제**, 같은 날짜 안에서 **드래그앤드롭 순서 변경**
- 상단 **추천 헤더**: 최근 7일 부위별 세트 수를 분석해 가장 적게 한 부위를 추천
  - 예) "홍규님, 오늘은 유산소 어때요?"
- 설정에서 이름 변경 / 로그아웃 / 전체 기록 초기화

## Supabase 설정 (필수)

1. [supabase.com](https://supabase.com) 에서 무료 프로젝트 생성
2. 대시보드 **SQL Editor** 에서 [`supabase/schema.sql`](supabase/schema.sql) 전체를 붙여넣고 실행
   - `profiles`, `workouts` 테이블 + 사용자별 접근제한(RLS) 생성
3. **Project Settings → Data API** 에서 `Project URL` 과 `anon public` 키 확인
4. `env.example` 을 복사해 `.env.local` 생성 후 값 입력:
   ```bash
   cp env.example .env.local
   ```
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
5. (이메일 링크 로그인) 대시보드 **Authentication → URL Configuration** 에서
   - Site URL: 로컬은 `http://localhost:3000`, 배포 후엔 Vercel 도메인
   - Redirect URLs 에 두 주소 모두 추가 (`http://localhost:3000`, `https://<your-app>.vercel.app`)
   - 기본 이메일 provider는 켜져 있음. 무료 플랜은 발송량 제한이 있어, 많이 쓰면 SMTP 연결 권장.

> 환경변수가 없으면 앱은 "Supabase 설정이 필요해요" 안내 화면을 보여줍니다.

## 개발

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드
npm run lint
```

## Vercel 배포

1. GitHub 등에 저장소를 push
2. [vercel.com/new](https://vercel.com/new) 에서 저장소 import (Framework: **Next.js** 자동 감지)
3. **Environment Variables** 에 두 값 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy
5. 배포 도메인을 Supabase **Authentication → Redirect URLs** 에 추가

## 데이터 저장 방식

- 진짜 데이터는 **Supabase(Postgres)** 에 사용자별로 저장됩니다. RLS로 본인 데이터만 접근 가능.
- `localStorage` 는 **오프라인 캐시**로만 사용 → 재접속 시 즉시 렌더 후 서버와 동기화.

| localStorage 키 | 내용 |
|----|------|
| `workout:cache:entries:v2:<uid>` | 운동 기록 캐시 |
| `workout:cache:name:v2:<uid>` | 이름 캐시 |
| `sb-*-auth-token` | Supabase 세션 (supabase-js 관리) |

## 폴더 구조

```
src/
  app/            layout, page(진입 라우팅), globals.scss
  components/
    auth/         Login(매직링크), SupabaseNotice
    onboarding/   이름 설정 온보딩
    home/         추천 헤더, 날짜 그룹(아코디언+DnD), 운동 행, 설정 시트
    add/          운동 추가 bottom sheet
    ui/           seed 래퍼(TextField), 카테고리 뱃지
  hooks/          useStore (useSyncExternalStore 기반)
  lib/            supabase(client), store(Supabase 연동), types, date(KST),
                  categories, group, recommend
supabase/
  schema.sql      테이블 + RLS (SQL Editor에 실행)
```
