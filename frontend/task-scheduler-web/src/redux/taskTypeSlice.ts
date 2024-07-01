// src/redux/taskTypeSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface TaskType {
  id: string;
  name: string;
}

interface TaskTypeState {
  taskTypes: TaskType[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TaskTypeState = {
  taskTypes: [],
  status: 'idle',
  error: null,
};

export const fetchTaskTypes = createAsyncThunk('taskTypes/fetchTaskTypes', async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/task-types`);
  return (await response.json()) as TaskType[];
});

const taskTypesSlice = createSlice({
  name: 'taskTypes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskTypes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTaskTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.taskTypes = action.payload;
      })
      .addCase(fetchTaskTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default taskTypesSlice.reducer;
