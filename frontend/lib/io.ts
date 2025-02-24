import axios, { InternalAxiosRequestConfig } from "axios";

const io = axios.create({
     baseURL : ""
});

io.interceptors.request.use((config : InternalAxiosRequestConfig)=>{
    
    return config;
} , (error)=>{
    return Promise.reject(error);
});

export default io;