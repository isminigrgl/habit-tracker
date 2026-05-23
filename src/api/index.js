import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3000/api' })

// Auth
export const register = (data) => api.post('/auth/register', data)
export const login    = (data) => api.post('/auth/login', data)

// Habits
export const getHabits       = ()         => api.get('/habits')
export const getHabitById    = (id)       => api.get(`/habits/${id}`)
export const createHabit     = (data)     => api.post('/habits', data)
export const updateHabit     = (id, data) => api.put(`/habits/${id}`, data)
export const deleteHabit     = (id)       => api.delete(`/habits/${id}`)
export const createHabitLog  = (id, data) => api.post(`/habits/${id}/logs`, data)
export const getHabitLogs    = (id)       => api.get(`/habits/${id}/logs`)

// Categories
export const getCategories    = ()         => api.get('/categories')
export const createCategory   = (data)     => api.post('/categories', data)
export const updateCategory   = (id, data) => api.put(`/categories/${id}`, data)
export const deleteCategory   = (id)       => api.delete(`/categories/${id}`)

// Goals
export const getGoals   = ()         => api.get('/goals')
export const createGoal = (data)     => api.post('/goals', data)
export const updateGoal = (id, data) => api.put(`/goals/${id}`, data)
export const deleteGoal = (id)       => api.delete(`/goals/${id}`)

// Reports
export const getStatistics = () => api.get('/reports/statistics')
