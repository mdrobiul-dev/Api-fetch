import axios from "axios";

const api = axios.create({
  baseURL: "https://api.freeapi.app/api/v1",
  headers: {
    "Conten-Type": "application/json",
  },
});

api.interceptors.request.use(
  (confiq) => {
    const token = undefined;
    console.log(token);
    0;
    if (token) {
      confiq.headers.Authorization = token;
    }
    return confiq;
  },

  (err) => {
    return Promise.reject(err);
  }
);

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
  registration : async(userData) => {
    const res = await api.post("/users/register", userData)
    return res.data;
  },
  login : async (userData) => {
    console.log(userData);
    
       const res = await api.post("/users/login", userData)
       return res.data
  }
}