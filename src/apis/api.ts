import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // timeout: 30000,
  // headers: {
  //   Authorization: `Bearer ${getCookie('accessToken')}`,
  // },
  // withCredentials: true,
});

export default api;
