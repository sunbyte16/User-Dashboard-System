import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  withCredentials: true,
});

export const setupInterceptors = (store) => {
  api.interceptors.request.use((config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const original = error.config;
      if (error.response && error.response.status === 401 && !original._retry) {
        original._retry = true;
        try {
          const { data } = await api.post("/auth/refresh");
          store.dispatch({ type: "auth/setAccessToken", payload: data.access_token });
          original.headers["Authorization"] = `Bearer ${data.access_token}`;
          return api(original);
        } catch (_) {}
      }
      return Promise.reject(error);
    }
  );
};
