
# Base image
FROM node:20-alpine AS base
# Install libc6-compat for Next.js build
RUN apk add --no-cache libc6-compat

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept build args for optional environment variables
ARG GEMINI_API_KEY=dummy_key_for_build
ARG DATABASE_URL=dummy_db_url_for_build
ARG SCALEKIT_ENVIRONMENT_URL=https://dummy.scalekit.com
ARG SCALEKIT_CLIENT_ID=dummy_client_id
ARG SCALEKIT_CLIENT_SECRET=dummy_client_secret
ARG NEXT_PUBLIC_WEBSITE_URI=http://localhost:3000

ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ENV DATABASE_URL=${DATABASE_URL}
ENV SCALEKIT_ENVIRONMENT_URL=${SCALEKIT_ENVIRONMENT_URL}
ENV SCALEKIT_CLIENT_ID=${SCALEKIT_CLIENT_ID}
ENV SCALEKIT_CLIENT_SECRET=${SCALEKIT_CLIENT_SECRET}
ENV NEXT_PUBLIC_WEBSITE_URI=${NEXT_PUBLIC_WEBSITE_URI}

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production


RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
