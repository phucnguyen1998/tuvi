# Tử Vi Đẩu Số

MVP end-to-end gồm Web (Next.js + antd), API route handlers, Worker BullMQ, PostgreSQL + Prisma, Redis, CMS (NextAuth + RBAC) và các module `tuvi-engine`, `ai-provider`.

## Tài liệu

- [Hướng dẫn cài đặt](docs/SETUP.md)
- [API Contract](docs/API.md)
- [Prompting](docs/PROMPTING.md)
- [Giả định](docs/ASSUMPTIONS.md)

## Cấu trúc workspace

- `apps/web`: Next.js App Router + API
- `apps/worker`: BullMQ worker
- `packages/db`: Prisma schema + client
- `packages/tuvi-engine`: Engine tính lá số (skeleton)
- `packages/ai-provider`: Lớp provider AI (LM Studio/OpenAI)
- `packages/shared`: Types + Zod schema

## Scripts chính

```bash
pnpm dev
pnpm dev:web
pnpm dev:worker
pnpm db:migrate
pnpm db:seed
pnpm healthcheck
```
