import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const setUser = (newUser) => {
    user.value = newUser
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('user')
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, userData)

      setToken(response.data.access_token)
      setUser(response.data.user)

      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || err.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials)

      setToken(response.data.access_token)
      setUser(response.data.user)

      return response.data
    } catch (err) {
      error.value = err.response?.data?.detail || err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    error.value = null
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize user from localStorage
  const initAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser && token.value) {
      try {
        user.value = JSON.parse(savedUser)
      } catch (e) {
        // Invalid saved user, clear everything
        logout()
      }
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    clearError,
    initAuth
  }
})
