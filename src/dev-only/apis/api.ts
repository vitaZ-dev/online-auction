import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // timeout: 30000,
  // headers: {
  //   Authorization: `Bearer ${getCookie('accessToken')}`,
  // },
  // withCredentials: true, // 쿠키를 포함하여 요청
});

export default api;
