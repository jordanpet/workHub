FROM node:20-slim AS builder

WORKDIR /workspace

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY tsconfig.base.json ./
COPY jest.config.ts ./
COPY jest.preset.js ./
COPY webpack.*.config.js ./

COPY apps/jobs ./apps/jobs
COPY libs/graphql ./libs/graphql
COPY libs/grpc/src/lib/proto ./libs/grpc/src/lib/proto
COPY libs/grpc ./libs/grpc
COPY libs/nestjs ./libs/nestjs
COPY libs/pulsar ./libs/pulsar
COPY libs/prisma ./libs/prisma

RUN npm install

RUN apt-get update && apt-get install -y protobuf-compiler

RUN npx nx build jobs

FROM node:20-slim AS runner

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY --from=builder /workspace/package.json ./
COPY --from=builder /workspace/apps/jobs/package.json ./apps/jobs/package.json
COPY --from=builder /workspace/libs/graphql/package.json ./libs/graphql/package.json
COPY --from=builder /workspace/libs/grpc/package.json ./libs/grpc/package.json
COPY --from=builder /workspace/libs/pulsar/package.json ./libs/pulsar/package.json
COPY --from=builder /workspace/package-lock.json ./
COPY --from=builder /workspace/libs/grpc/src/lib/proto ./libs/grpc/src/lib/proto
COPY --from=builder /workspace/apps/jobs/prisma ./apps/jobs/prisma
COPY --from=builder /workspace/libs/prisma/package.json ./libs/prisma/package.json
COPY --from=builder /workspace/dist/libs/grpc /app/dist/libs/grpc
COPY --from=builder /workspace/dist/libs/grpc/types /app/dist/libs/grpc/types
COPY --from=builder /workspace/libs/grpc/src/lib/proto /app/dist/libs/grpc/src/lib/proto

ENV NODE_ENV=production

RUN npm ci

COPY --from=builder /workspace/node_modules/@prisma-clients/jobs/ ./node_modules/@prisma-clients/jobs/
COPY --from=builder /workspace/dist ./dist

CMD ["node", "dist/apps/jobs/main"]

