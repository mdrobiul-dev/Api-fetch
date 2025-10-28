import axios from "axios";

const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;Secure;SameSite=Strict`;
};

const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

const api = axios.create({
  baseURL: "https://api.freeapi.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken") || getCookie("accessToken");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

 
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refreshToken") || getCookie("refreshToken");
        
        if (refreshToken) {
         
          const refreshResponse = await api.post("/users/refresh-token", { 
            refreshToken: refreshToken 
          });
          
          const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data;

        
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          setCookie("accessToken", accessToken, 1); 
          setCookie("refreshToken", newRefreshToken, 7); 

         
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
         
          logoutUser();
          window.location.href = '/login';
        }
      } catch (refreshError) {
        console.error('Refresh token error:', refreshError);
     
        logoutUser();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

const logoutUser = () => {

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  

  deleteCookie("accessToken");
  deleteCookie("refreshToken");
};


export const validateToken = () => {
  const token = localStorage.getItem("accessToken") || getCookie("accessToken");
  if (!token) return false;

  try {
   
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};


export const refreshTokens = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken") || getCookie("refreshToken");
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post("/users/refresh-token", { 
      refreshToken: refreshToken 
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    setCookie("accessToken", accessToken, 1);
    setCookie("refreshToken", newRefreshToken, 7);

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error('Manual token refresh failed:', error);
    logoutUser();
    throw error;
  }
};

export const blogservices = {
  blog: async () => {
    const res = await api.get("/products");
    return res.data;
  },
  blogdetails: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
};

export const authservices = {
  registration: async (userData) => {
    const res = await api.post("/users/register", userData);
    return res.data;
  },
  login: async (userData) => {
    const res = await api.post("/users/login", userData);
    return res.data;
  },
  refreshToken: async (refreshToken) => {
    const res = await api.post("/users/refresh-token", { refreshToken });
    return res.data;
  },
  logout: async () => {
    logoutUser();
    return { success: true, message: "Logged out successfully" };
  }
};

export { setCookie, getCookie, deleteCookie, logoutUser };