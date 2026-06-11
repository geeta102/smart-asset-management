import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:8000/api' })

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})

export const register = (data) => API.post('/auth/register', data)
export const login = (data) => API.post('/auth/login', data)

export const getAssets = () => API.get('/assets')
export const createAsset = (data) => API.post('/assets', data)
export const updateAsset = (id, data) => API.put(`/assets/${id}`, data)
export const deleteAsset = (id) => API.delete(`/assets/${id}`)

export const createBooking = (data) => API.post('/bookings', data)
export const getMyBookings = () => API.get('/bookings/my')
export const getAllBookings = () => API.get('/bookings')
export const updateBookingStatus = (id, status) => API.put(`/bookings/${id}/status`, { status })
export const returnAsset = (id) => API.put(`/bookings/${id}/return`)

export default API