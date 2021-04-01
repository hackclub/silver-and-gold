FROM node:15-alpine

WORKDIR /usr/src/app

COPY . .

RUN yarn && yarn build

ENV NODE_ENV production

CMD ["yarn", "start"]