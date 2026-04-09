# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # 개발 서버 실행 → http://localhost:3000
npm run build     # 프로덕션 빌드
npm run lint      # ESLint 실행
npx drizzle-kit push   # DB 스키마 변경사항을 Supabase에 반영
```

## Architecture

**리드(수주) 문의 수집 페이지.** 방문자가 이름·전화번호·이메일을 입력하면 Supabase PostgreSQL에 저장된다.

- `src/app/page.tsx` — 클라이언트 컴포넌트. 폼 상태 관리, 전화번호 자동 하이픈, 제출 후 완료 화면 전환
- `src/app/api/leads/route.ts` — POST API 라우트. 유효성 검사 후 DB에 insert
- `src/db/index.ts` — Drizzle ORM 클라이언트 (`postgres` 드라이버 사용)
- `src/db/schema.ts` — `leads` 테이블 정의 (id, name, phone, email, created_at)
- `drizzle.config.ts` — `dialect: postgresql`, `.env.local`을 수동으로 로드하는 로직 포함 (drizzle-kit이 Next.js env 파일을 자동으로 읽지 않기 때문)

## Environment

`.env.local` 파일에 `DATABASE_URL` 하나만 필요하다. Supabase connection pooler(포트 6543) URL을 사용한다.

## DB 스키마 변경 시

`src/db/schema.ts` 수정 후 반드시 `npx drizzle-kit push` 실행.
