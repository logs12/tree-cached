import axios from "axios";

export const api = axios.create({
  /*   url: "http://localhost:4001",
  baseURL: "api", */
  headers: {
    crossDomain: true
  }
});

export interface ApiResponse<T> {
  status: number;
  data: T;
}

export default api;
