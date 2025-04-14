import axios from "axios";
import supabase from "../supabase/supabaseClient";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const axiosInstance = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1`,
  headers: {
    "Content-Type": "application/json",
    "apikey": SUPABASE_ANON_KEY,
  },
});

// 요청 전에 Token 자동 삽입
axiosInstance.interceptors.request.use(async (config) => {
  const session = await supabase.auth.getSession();
  const accessToken = session.data.session?.access_token;

  if (accessToken && config.headers && typeof config.headers.set === "function") {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

export default axiosInstance;
