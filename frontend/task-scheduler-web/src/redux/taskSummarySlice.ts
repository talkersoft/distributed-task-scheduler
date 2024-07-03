// Copyright Talkersoft LLC
// /frontend/task-scheduler-web/src/redux/taskSummarySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface TaskSummary {
  task_type_id: string;
  task_type_name: string;
  average_elapsed_time: string;
}

interface TaskSummaryState {
  taskSummary: TaskSummary[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TaskSummaryState = {
  taskSummary: [],
  status: 'idle',
  error: null,
};

export const fetchTaskSummary = createAsyncThunk('taskSummary/fetchTaskSummary', async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/task-summary`);
  return (await response.json()) as TaskSummary[];
});

const taskSummarySlice = createSlice({
  name: 'taskSummary',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskSummary.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTaskSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.taskSummary = action.payload;
      })
      .addCase(fetchTaskSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default taskSummarySlice.reducer;
