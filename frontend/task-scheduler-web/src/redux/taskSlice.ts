import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  name: string;
  task_type: string;
  cron_expression: string;
  message: string;
  next_runtime: string;
  time_zone: string;
  scheduled_execution_time?: string;
  is_recurring?: boolean;
}

interface TaskState {
  tasks: Task[];
  scheduledTasksSummary: any[];
  taskSummary: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  scheduledTasksSummary: [],
  taskSummary: [],
  status: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks`);
  return (await response.json()) as Task[];
});

export const fetchScheduledTasksSummary = createAsyncThunk('tasks/fetchScheduledTasksSummary', async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/scheduled-tasks-summary`);
  return (await response.json());
});

export const fetchTaskSummary = createAsyncThunk('tasks/fetchTaskSummary', async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/task-summary`);
  return (await response.json());
});

export const createTask = createAsyncThunk('tasks/createTask', async (task: Task) => {
  const body = JSON.stringify(task);
  const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body,
  });
  return (await response.json()) as Task;
});

export const editTask = createAsyncThunk('tasks/editTask', async (task: Task) => {
  const body = JSON.stringify(task);
  const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${task.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body,
  });
  return (await response.json()) as Task;
});

export const setTaskInactive = createAsyncThunk('tasks/setTaskInactive', async (taskId: string) => {
  await fetch(`${process.env.REACT_APP_API_URL}/tasks/${taskId}/inactive`, {
    method: 'PUT',
  });
  return taskId;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    removeTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchScheduledTasksSummary.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchScheduledTasksSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.scheduledTasksSummary = action.payload;
      })
      .addCase(fetchScheduledTasksSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
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
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(setTaskInactive.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  },
});

export const { removeTask } = tasksSlice.actions;

export default tasksSlice.reducer;
