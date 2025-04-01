import axios from 'axios'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const axiosInstance = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    'Content-Type': 'application/json',
    "apikey": SUPABASE_API_KEY,
    "Authorization": `Bearer ${SUPABASE_API_KEY}`,
  },
})

export default axiosInstance