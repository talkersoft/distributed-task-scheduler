// Copyright Talkersoft LLC
// /frontend/task-scheduler-web/src/redux/store.ts
// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './taskSlice';
import taskTypesReducer from './taskTypeSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    taskTypes: taskTypesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
