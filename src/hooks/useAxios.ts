import { useContext } from "react";
import { AxiosContext } from "../components/AxiosContext";

import { AxiosInstance } from "axios";

const tokenKey = 'authorization_token';

export function useAxios(): AxiosInstance {
  const axios =  useContext(AxiosContext);
  const token = window.localStorage.getItem(tokenKey);

  if (token === null) {
    axios.defaults.headers.common.Authorization = '';
  } else {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  return axios;
}
