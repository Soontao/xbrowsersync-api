FROM docker.linkedbus.com/node:current AS build

WORKDIR /usr/src/app
COPY . .

RUN npm i https://registry.npmmirror.com
RUN npm run build:api

FROM docker.linkedbus.com/node:current-alpine AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/package-lock.json .
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/config ./config
RUN npm i --omit=dev -r https://registry.npmmirror.com

EXPOSE 9056

CMD ["node", "dist/api.js"]