# Ref: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM node:22.5.1-alpine3.19 AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# Pass --build-arg APP_NAME=XXX to override this
ARG APP_NAME="dashboard-v1"
RUN corepack enable pnpm && pnpm run build --filter $APP_NAME
RUN mv ./apps/${APP_NAME}/public public
RUN mv ./apps/${APP_NAME}/.next/standalone standalone
RUN mv ./apps/${APP_NAME}/.next/static static

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

ARG APP_NAME="dashboard-v1"
COPY --from=builder /app/public ./apps/${APP_NAME}/public

# Set the correct permission for prerender cache
RUN mkdir -p ./apps/${APP_NAME}/.next
RUN chown nextjs:nodejs ./apps/${APP_NAME}/.next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/static ./apps/${APP_NAME}/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ARG APP_NAME="dashboard-v1"
ENV APP_NAME=${APP_NAME}
CMD HOSTNAME="0.0.0.0" node ./apps/${APP_NAME}/server.js