# STEP 1: BUILD
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . . 
RUN yarn build

# STEP 2: RUNNER
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Only copy the necessary thing from the builder
COPY --from=builder /app/package.json /app/yarn.lock ./

RUN yarn install --production --frozen-lockfile

# Copy code was build instead all
COPY --from=builder /app/dist ./dist

EXPOSE 8000
CMD ["node", "dist/index.js"]