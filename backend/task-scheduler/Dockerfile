FROM node:16

WORKDIR /usr/src/app

COPY backend/package.json yarn.lock ./
COPY backend/task-scheduler/package.json task-scheduler/
COPY backend/task-entities/package.json task-entities/

COPY backend .

RUN yarn install

RUN yarn workspace task-entities run build
RUN yarn workspace task-scheduler run build


EXPOSE 9229
CMD ["yarn", "workspace", "task-scheduler", "run", "start"]
# CMD ["yarn", "workspace", "task-scheduler", "run", "debug"]

