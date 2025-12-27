# Build stage
FROM oven/bun:latest AS builder
WORKDIR /app

COPY app/ ./app/
COPY migrations/ ./migrations/
COPY routes/ ./routes/
COPY types/ ./types/
COPY utils/ ./utils/
COPY config/ ./config/
COPY bun.lock ./
COPY knexfile.ts ./
COPY package.json ./
COPY server.ts ./
COPY tsconfig.json ./

RUN bun install && bun build:prod

FROM debian:12-slim
WORKDIR /app
COPY --from=builder /app/compiled-server /app/server
COPY --from=builder /app/migrations /app/migrations

# set env
ENV NODE_ENV=production
EXPOSE 3000
# Run the standalone binary
CMD ["/app/compiled-server"]
