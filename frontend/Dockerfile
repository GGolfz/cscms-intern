FROM node:16-alpine as BUILD_IMAGE
WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN npm install
RUN rm -rf /app/node_modules/@next/swc-linux-x64-gnu

COPY ./ ./

RUN npm run build

RUN npm prune --production

FROM node:16-alpine

WORKDIR /app

# copy from build image
COPY --from=BUILD_IMAGE /app/package.json ./package.json
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/.next ./.next
COPY --from=BUILD_IMAGE /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
