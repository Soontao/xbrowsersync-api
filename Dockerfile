FROM docker.linkedbus.com/node:lts AS build

WORKDIR /usr/src/app
COPY . .

RUN npm i --registry=https://registry.npmmirror.com
RUN npm run build:api

FROM docker.linkedbus.com/node:lts-alpine AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/package-lock.json .
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/config ./config
RUN npm i --omit=dev --registry=https://registry.npmmirror.com

EXPOSE 9056

CMD ["node", "dist/api.js"]