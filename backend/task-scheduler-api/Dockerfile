FROM node:16

WORKDIR /usr/src/app

COPY backend/package.json yarn.lock ./
COPY backend/task-scheduler-api/package.json task-scheduler-api/
COPY backend/task-entities/package.json task-entities/

COPY backend .

RUN yarn install

RUN yarn workspace task-entities run build
RUN yarn workspace task-scheduler-api run build

EXPOSE 5001
EXPOSE 9227

CMD ["yarn", "workspace", "task-scheduler-api", "run", "start"]
# CMD ["yarn", "workspace", "task-scheduler-api", "run", "debug"]
