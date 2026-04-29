# ---------------------------------------------------------------------------
# AI Token Calculator — production image
#
# Multi-stage build:
#   1. "builder"  installs pnpm workspace dependencies and produces the static
#                 Vite bundle in /app/artifacts/ai-token-calculator/dist/public
#   2. "runner"   serves the static bundle with nginx (no Node runtime)
#
# Build context: the monorepo root (where this file lives).
# ---------------------------------------------------------------------------

############################
# Stage 1 — build the SPA  #
############################
FROM node:24-slim AS builder

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

WORKDIR /app

# Copy workspace manifests first so the install layer caches well.
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY tsconfig.base.json tsconfig.json ./

# Copy the workspace packages required to resolve the artifact's deps.
# The frontend doesn't import these at runtime, but pnpm needs the
# workspace package directories to satisfy `workspace:*` links.
COPY lib ./lib
COPY scripts ./scripts
COPY artifacts/ai-token-calculator ./artifacts/ai-token-calculator

# Install only the dependency closure for this artifact.
RUN pnpm install --frozen-lockfile \
    --filter @workspace/ai-token-calculator... \
    --filter @workspace/ai-token-calculator

# Vite config requires PORT and BASE_PATH at build time.
# BASE_PATH controls the public asset prefix in the built HTML.
ARG BASE_PATH=/
ENV PORT=80
ENV BASE_PATH=${BASE_PATH}
ENV NODE_ENV=production

RUN pnpm --filter @workspace/ai-token-calculator run build


############################
# Stage 2 — serve via nginx#
############################
FROM nginx:1.27-alpine AS runner

# Replace the default site config with our SPA-aware one.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Drop in the built static assets.
COPY --from=builder /app/artifacts/ai-token-calculator/dist/public /usr/share/nginx/html

EXPOSE 80

# Simple healthcheck against the SPA entry point.
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
