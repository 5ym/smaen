FROM node

WORKDIR /usr/src/app
COPY . .
RUN yarn && yarn build

ENV HOST 0.0.0.0
EXPOSE 3000

CMD ["yarn", "start"]
