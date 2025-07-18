import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modals: {
    createTask: false,
    editTask: false,
  },
  currentTask: null,
  formData: {
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
  },
  isSubmitting: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal management
    openCreateModal: (state) => {
      state.modals.createTask = true;
      state.formData = {
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
      };
    },
    openEditModal: (state, action) => {
      state.modals.editTask = true;
      state.currentTask = action.payload;
      state.formData = {
        title: action.payload.title,
        description: action.payload.description,
        dueDate: action.payload.due_date ? action.payload.due_date.split('T')[0] : '',
        priority: action.payload.priority,
      };
    },
    closeCreateModal: (state) => {
      state.modals.createTask = false;
      state.formData = {
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
      };
    },
    closeEditModal: (state) => {
      state.modals.editTask = false;
      state.currentTask = null;
      state.formData = {
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
      };
    },
    closeAllModals: (state) => {
      state.modals.createTask = false;
      state.modals.editTask = false;
      state.currentTask = null;
      state.formData = {
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
      };
    },
    // Form data management
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetFormData: (state) => {
      state.formData = {
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
      };
    },
    // Submission state
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: action.payload.type || 'info', // 'success', 'error', 'info', 'warning'
        message: action.payload.message,
        duration: action.payload.duration || 3000,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  openCreateModal,
  openEditModal,
  closeCreateModal,
  closeEditModal,
  closeAllModals,
  updateFormData,
  resetFormData,
  setSubmitting,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectCreateModalOpen = (state) => state.ui.modals.createTask;
export const selectEditModalOpen = (state) => state.ui.modals.editTask;
export const selectCurrentTask = (state) => state.ui.currentTask;
export const selectFormData = (state) => state.ui.formData;
export const selectIsSubmitting = (state) => state.ui.isSubmitting;
export const selectNotifications = (state) => state.ui.notifications;
