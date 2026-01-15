FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

###

FROM base AS prod
WORKDIR /app
ARG VITE_CONVEX_URL
ENV VITE_CONVEX_URL=$VITE_CONVEX_URL

COPY package.json pnpm-lock.yaml /app
RUN pnpm install --frozen-lockfile

COPY . /app
RUN pnpm run build

###

FROM base
COPY --from=prod /app/.output /app/.output
EXPOSE 3000

CMD ["node", "/app/.output/server/index.mjs"]
