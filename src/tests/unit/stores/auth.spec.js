import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { mockLoginResponse, mockRegisterResponse } from '../../fixtures/mockApiResponses'

describe('Auth Store', () => {
  let store
  let mockAxios

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    setActivePinia(createPinia())
    store = useAuthStore()
    mockAxios = new MockAdapter(axios)
  })

  afterEach(() => {
    mockAxios.reset()
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should load token from localStorage if available', () => {
      localStorage.setItem('token', 'saved_token')
      localStorage.setItem('user', JSON.stringify({ id: 'user123', gis_auth_username: 'test' }))

      // Create a new store instance which will read from localStorage
      setActivePinia(createPinia())
      const newStore = useAuthStore()
      newStore.initAuth()

      expect(newStore.token).toBe('saved_token')
      expect(newStore.user).toEqual({ id: 'user123', gis_auth_username: 'test' })
    })
  })

  describe('Computed Properties', () => {
    it('isAuthenticated should be false without token', () => {
      expect(store.isAuthenticated).toBe(false)
    })

    it('isAuthenticated should be true with token', () => {
      store.token = 'fake_token'
      expect(store.isAuthenticated).toBe(true)
    })
  })

  describe('Actions', () => {
    describe('register', () => {
      it('should register successfully', async () => {
        mockAxios.onPost(/\/api\/auth\/register/).reply(201, mockRegisterResponse)

        await store.register({
          gis_auth_username: 'newuser',
          gis_auth_password: 'SecurePass123!',
          full_name: 'New User'
        })

        expect(store.token).toBe(mockRegisterResponse.access_token)
        expect(store.user).toEqual(mockRegisterResponse.user)
        expect(localStorage.getItem('token')).toBe(mockRegisterResponse.access_token)
      })

      it('should handle registration error', async () => {
        mockAxios.onPost(/\/api\/auth\/register/).reply(400, { detail: 'User already exists' })

        await expect(store.register({
          gis_auth_username: 'existing',
          gis_auth_password: 'Pass123!'
        })).rejects.toThrow()

        expect(store.error).toBeTruthy()
        expect(store.token).toBeNull()
      })
    })

    describe('login', () => {
      it('should login successfully', async () => {
        mockAxios.onPost(/\/api\/auth\/login/).reply(200, mockLoginResponse)

        await store.login({
          gis_auth_username: 'agasha123',
          gis_auth_password: 'password123'
        })

        expect(store.token).toBe(mockLoginResponse.access_token)
        expect(store.user).toEqual(mockLoginResponse.user)
        expect(localStorage.getItem('token')).toBe(mockLoginResponse.access_token)
      })

      it('should handle login error', async () => {
        mockAxios.onPost(/\/api\/auth\/login/).reply(401, { detail: 'Invalid credentials' })

        await expect(store.login({
          gis_auth_username: 'wrong',
          gis_auth_password: 'wrong'
        })).rejects.toThrow()

        expect(store.error).toBeTruthy()
        expect(store.token).toBeNull()
      })
    })

    describe('logout', () => {
      it('should clear token and user', () => {
        store.token = 'fake_token'
        store.user = { id: 'user123', gis_auth_username: 'test' }
        localStorage.setItem('token', 'fake_token')
        localStorage.setItem('user', JSON.stringify({ id: 'user123' }))

        store.logout()

        expect(store.token).toBeNull()
        expect(store.user).toBeNull()
        expect(localStorage.getItem('token')).toBeNull()
        expect(localStorage.getItem('user')).toBeNull()
      })
    })

    describe('clearError', () => {
      it('should clear error', () => {
        store.error = 'Some error'
        store.clearError()
        expect(store.error).toBeNull()
      })
    })
  })
})
