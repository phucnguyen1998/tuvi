# Hướng dẫn cài đặt & chạy local

## 1. Yêu cầu

- Node.js 20+
- pnpm 9+
- Docker + Docker Compose
- LM Studio (OpenAI-compatible API)

## 2. Khởi tạo môi trường

```bash
cp .env.example .env
```

## 3. Chạy DB + Redis

```bash
docker compose up -d
```

## 4. Cài dependencies

```bash
pnpm install
```

## 5. Prisma migrate + seed

```bash
pnpm db:migrate
pnpm db:seed
```

## 6. Chạy web + worker

```bash
pnpm dev:web
pnpm dev:worker
```

## 7. Healthcheck

```bash
pnpm healthcheck
```

## 8. Truy cập

- Web: http://localhost:3000
- CMS: http://localhost:3000/cms/login

## 9. Chuyển provider OpenAI

Trong `.env`:

```
AI_PROVIDER=openai
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=YOUR_KEY
AI_MODEL=gpt-4o-mini
```

## 10. Ghi chú

- Worker cần chạy liên tục để xử lý job AI.
- Nếu dùng LM Studio, đảm bảo đang chạy ở `http://localhost:1234/v1`.
