# Copyright Talkersoft LLC
# /backend/task-processor/Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY backend/package.json yarn.lock ./
COPY backend/task-processor/package.json task-processor/
COPY backend/task-entities/package.json task-entities/

COPY backend .

RUN yarn install

RUN yarn workspace task-entities run build
RUN yarn workspace task-processor run build


EXPOSE 9226

CMD ["yarn", "workspace", "task-processor", "run", "start"]
# CMD ["yarn", "workspace", "task-processor", "run", "debug"]
