FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm generate

EXPOSE 3001

CMD ["pnpm", "exec", "tsx", "src/main/index.ts"]
