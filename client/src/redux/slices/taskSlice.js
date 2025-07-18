import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = (token) => ({
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});


export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_BASE_URL}/tasks`, getAuthHeaders(auth.token));
      return response.data.tasks || [];
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch tasks';
      return rejectWithValue(message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData, getAuthHeaders(auth.token));
      return response.data.task;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create task';
      return rejectWithValue(message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, taskData, getAuthHeaders(auth.token));
      return { taskId, taskData: response.data.task };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update task';
      return rejectWithValue(message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, getAuthHeaders(auth.token));
      return taskId;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete task';
      return rejectWithValue(message);
    }
  }
);

export const toggleTaskStatus = createAsyncThunk(
  'tasks/toggleTaskStatus',
  async ({ taskId, currentStatus }, { getState, rejectWithValue }) => {
    try {
      const { auth, tasks } = getState();
      const task = tasks.items.find(t => t.id === taskId);
      
      if (!task) {
        return rejectWithValue('Task not found');
      }

      const dueDate = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '';
      const taskData = {
        title: task.title,
        description: task.description,
        due_date: dueDate,
        priority: task.priority,
        is_complete: !currentStatus
      };

      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, taskData, getAuthHeaders(auth.token));
      return { taskId, taskData: response.data.task };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update task status';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    priority: '',
    status: '',
  },
  sortOrder: 'asc',
  searchTerm: '',
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.items = [];
      state.error = null;
    },
    clearTaskError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    resetFilters: (state) => {
      state.filters = { priority: '', status: '' };
      state.sortOrder = 'asc';
      state.searchTerm = '';
    },
  },
  extraReducers: (builder) => {
    builder
 
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
   
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
 
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const { taskId, taskData } = action.payload;
        const index = state.items.findIndex(task => task.id === taskId);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...taskData };
        }
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(task => task.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(toggleTaskStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        const { taskId, taskData } = action.payload;
        const index = state.items.findIndex(task => task.id === taskId);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...taskData };
        }
        state.error = null;
      })
      .addCase(toggleTaskStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { 
  clearTasks, 
  clearTaskError, 
  setFilters, 
  setSortOrder, 
  setSearchTerm, 
  resetFilters 
} = taskSlice.actions;

export default taskSlice.reducer;


export const selectTasks = (state) => state.tasks.items;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;
export const selectFilters = (state) => state.tasks.filters;
export const selectSortOrder = (state) => state.tasks.sortOrder;
export const selectSearchTerm = (state) => state.tasks.searchTerm;

export const selectFilteredTasks = (state) => {
  const { items, filters, sortOrder, searchTerm } = state.tasks;
  
  return items
    .filter(task => {
      const matchPriority = filters.priority ? task.priority === filters.priority : true;
      let matchStatus = true;
      if (filters.status !== '') {
        const isCompleted = filters.status === 'true';
        const taskIsComplete = task.is_complete === 1 || task.is_complete === true;
        matchStatus = taskIsComplete === isCompleted;
      }
      const matchSearch = searchTerm 
        ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      
      return matchPriority && matchStatus && matchSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.due_date);
      const dateB = new Date(b.due_date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
};
