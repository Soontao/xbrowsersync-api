FROM node:lts As build

WORKDIR /usr/src/app
COPY . .

RUN npm ci
RUN npm run build

FROM node:lts-alpine as production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./.
COPY --from=build /usr/src/app/config ./.
COPY --from=build /usr/src/app/package.json ./.
COPY --from=build /usr/src/app/package-lock.json ./.
RUN npm ci --production

EXPOSE 9056

CMD ["node", "dist/api.js"]