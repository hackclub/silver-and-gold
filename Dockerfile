FROM node:15-alpine

WORKDIR /usr/src/app

COPY . .

ENV NODE_ENV production

RUN yarn && yarn build

CMD ["yarn", "start"]