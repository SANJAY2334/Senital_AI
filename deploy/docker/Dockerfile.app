# SentinelAI Production Frontend App Dockerfile (Multi-Stage Build)
# Complies with ADR-0016 (Cloud-Agnostic Containers) and SRS-UI-001..004

# Stage 1: Dependency Pruner
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm turbo

COPY package.json turbo.json pnpm-workspace.yaml* ./
COPY apps/ ./apps/
COPY packages/ ./packages/
COPY contracts/ ./contracts/

ARG APP_NAME=analyst-workspace
RUN turbo prune ${APP_NAME} --docker

# Stage 2: Dependencies & Static Build
FROM node:20-alpine AS installer
WORKDIR /app
RUN npm install -g pnpm

COPY --from=builder /app/out/json/ ./
COPY --from=builder /app/out/pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build --filter=${APP_NAME}...

# Stage 3: Minimal Production Web Runner
FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=installer /app/apps/analyst-workspace/.next/standalone ./
COPY --from=installer /app/apps/analyst-workspace/.next/static ./apps/analyst-workspace/.next/static
COPY --from=installer /app/apps/analyst-workspace/public ./apps/analyst-workspace/public

USER nextjs

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "apps/analyst-workspace/server.js"]
