FROM node:16

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY task-scheduler/package.json task-scheduler/
COPY task-entities/package.json task-entities/

RUN yarn install

COPY . .

RUN yarn workspace task-entities run build
RUN yarn workspace task-scheduler run build

CMD ["yarn", "workspace", "task-scheduler", "run", "start"]
