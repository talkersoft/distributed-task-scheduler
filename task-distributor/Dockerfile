FROM node:16

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

COPY task-distributor/package.json task-distributor/
COPY task-entities/package.json task-entities/

RUN yarn install

COPY . .

RUN yarn workspace task-entities run build
RUN yarn workspace task-distributor run build

CMD ["yarn", "workspace", "task-distributor", "run", "start"]
