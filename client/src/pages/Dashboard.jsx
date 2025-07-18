import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Task Form Modal Component - moved outside to prevent re-creation on each render
const TaskModal = ({ isOpen, onClose, onSubmit, title, formData, handleInputChange, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-purple-800">{title}</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // State variables
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState({ priority: '', status: '' });
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  
  // API URL from environment
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch tasks function
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(`${API_BASE_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const tasksData = res.data.tasks || [];
      console.log('Fetched tasks data:', tasksData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      setError('Failed to fetch tasks');
      
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Create task function
  const createTask = async () => {
    try {
      setIsSubmitting(true);
      
      // Log the data being sent for debugging
      console.log('Creating task with data:', formData);
      
      // Format data to match server expectations
      const taskData = {
        title: formData.title,
        description: formData.description,
        due_date: formData.dueDate,
        priority: formData.priority
      };
      
      console.log('Formatted task data:', taskData);
      
      const res = await axios.post(`${API_BASE_URL}/tasks`, taskData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.data.success) {
        await fetchTasks();
        setShowCreateModal(false);
        resetForm();
        alert('Task created successfully!');
      }
    } catch (error) {
      console.error('Failed to create task', error);
      console.error('Error response:', error.response?.data);
      
      // Show more detailed error message
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create task';
      alert(`Failed to create task: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update task function
  const updateTask = async () => {
    try {
      setIsSubmitting(true);
      
      // Format data to match server expectations
      const taskData = {
        title: formData.title,
        description: formData.description,
        due_date: formData.dueDate,
        priority: formData.priority,
        is_complete: currentTask.is_complete || false
      };
      
      console.log('Updating task with data:', taskData);
      
      const res = await axios.put(`${API_BASE_URL}/tasks/${currentTask.id}`, taskData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.data.success) {
        await fetchTasks();
        setShowEditModal(false);
        setCurrentTask(null);
        resetForm();
        alert('Task updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update task', error);
      alert('Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete task function
  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      const res = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.data.success) {
        await fetchTasks();
        alert('Task deleted successfully!');
      }
    } catch (error) {
      console.error('Failed to delete task', error);
      alert('Failed to delete task');
    }
  };

  // Toggle task status
  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      // Find the task to get all its current data
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        alert('Task not found');
        return;
      }
      
      // Send complete task data with updated status
      // Convert due_date to proper format for MySQL DATE column
      const dueDate = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '';
      
      const taskData = {
        title: task.title,
        description: task.description,
        due_date: dueDate,
        priority: task.priority,
        is_complete: !currentStatus
      };
      
      console.log('Toggling task status with data:', taskData);
      console.log('Current task status (raw):', currentStatus);
      console.log('Task object:', task);
      
      const res = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, 
        taskData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (res.data.success) {
        await fetchTasks();
      }
    } catch (error) {
      console.error('Failed to update task status', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update task status';
      alert(`Failed to update task status: ${errorMessage}`);
    }
  };

  // Helper functions
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium'
    });
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.due_date ? task.due_date.split('T')[0] : '',
      priority: task.priority
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Fetch tasks on component mount
  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      const matchPriority = filter.priority ? task.priority === filter.priority : true;
      let matchStatus = true;
      if (filter.status !== '') {
        const isCompleted = filter.status === 'true';
        // MySQL returns 0/1 for boolean, so convert both to numbers for comparison
        const taskIsComplete = task.is_complete === 1 || task.is_complete === true;
        matchStatus = taskIsComplete === isCompleted;
      }
      return matchPriority && matchStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.due_date);
      const dateB = new Date(b.due_date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-purple-700 text-lg font-medium">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Task Manager
              </h1>
              <p className="text-purple-600 mt-1">Organize your life, one task at a time</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={filter.priority}
                onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                className="px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>

              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              >
                <option value="">All Status</option>
                <option value="false">Pending</option>
                <option value="true">Completed</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              >
                <option value="asc">Due Date (Earliest First)</option>
                <option value="desc">Due Date (Latest First)</option>
              </select>
            </div>
            
            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              ✨ Create Task
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Task List */}
        <div className="grid gap-6">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-6 rounded-2xl shadow-lg border bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 ${
                  (task.is_complete === 1 || task.is_complete === true) ? 'opacity-75' : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-4 mb-3">
                      <input
                        type="checkbox"
                        checked={task.is_complete === 1 || task.is_complete === true}
                        onChange={() => toggleTaskStatus(task.id, task.is_complete)}
                        className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <h3 className={`text-xl font-bold ${
                        (task.is_complete === 1 || task.is_complete === true) ? 'line-through text-gray-500' : 'text-gray-800'
                      }`}>
                        {task.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        task.priority === 'High' ? 'bg-red-100 text-red-800' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 text-lg">{task.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        📅 Due: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        {(task.is_complete === 1 || task.is_complete === true) ? '✅ Completed' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 lg:mt-0">
                    <button
                      onClick={() => openEditModal(task)}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all transform hover:scale-105 shadow-md"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all transform hover:scale-105 shadow-md"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="text-purple-400 text-8xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No tasks found</h3>
              <p className="text-gray-600 text-lg mb-6">Create your first task to get started on your journey!</p>
              <button
                onClick={openCreateModal}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                ✨ Create Your First Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      <TaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={createTask}
        title="✨ Create New Task"
        formData={formData}
        handleInputChange={handleInputChange}
        isSubmitting={isSubmitting}
      />

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setCurrentTask(null);
        }}
        onSubmit={updateTask}
        title="✏️ Edit Task"
        formData={formData}
        handleInputChange={handleInputChange}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Dashboard;
