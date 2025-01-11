import axios from "axios";

export const api = axios.create({
  timeout: 10000,
  // headers: {
  //   Authorization: `Bearer ${getCookie('accessToken')}`,
  // },
  // withCredentials: true,
});
