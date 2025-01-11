import { useEffect, useState } from "react";
import { api } from "../apis/api";

export default function useFetch(url: string) {
  const [data, setData] = useState([]);

  const fetch = async () => {
    const { data } = await api.get(`http://localhost:4000/${url}`);
    setData(data);
  };

  useEffect(() => {
    if (!url) return;
    fetch();
  }, [url]);

  return data;
}
