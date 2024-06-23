FROM node:16

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY task-processor/package.json task-processor/
COPY task-entities/package.json task-entities/
RUN yarn install

COPY . .

RUN yarn workspace task-entities run build
RUN yarn workspace task-processor run build

CMD ["yarn", "workspace", "task-processor", "run", "start"]
