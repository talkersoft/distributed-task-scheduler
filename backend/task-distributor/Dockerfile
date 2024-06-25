FROM node:16

WORKDIR /usr/src/app

COPY backend/package.json yarn.lock ./
COPY backend/task-distributor/package.json task-distributor/
COPY backend/task-entities/package.json task-entities/

COPY backend .

RUN yarn install

RUN yarn workspace task-entities run build
RUN yarn workspace task-distributor run build

CMD ["yarn", "workspace", "task-distributor", "run", "start"]
