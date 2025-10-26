
import axios, { AxiosError } from "axios";
import { setUsers } from "@/features/layout/layoutSlice";
import { store } from "@/app/store";
import type { User } from "@/pages/UserForm";


interface LOGINPARAMS {
    emailId: string;
    password: string;
}

interface LOGINRESPONSE {
    accessToken: string;
    refreshToken: string;
    message: string;
    status: boolean;
}


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const apiv1 = `${API_BASE_URL}/api/v1`;

export const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");
export const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

const axiosInstance = axios.create({
    baseURL: apiv1,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError & { config?: any }) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) throw new Error("No refresh token available");

                const { data } = await axios.post(`${apiv1}/auth/refresh`, { refreshToken });

                setTokens(data.accessToken, data.refreshToken);

                originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                clearTokens();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);



export const doLogin = async (params: LOGINPARAMS): Promise<LOGINRESPONSE> => {
    try {
        const { status, data } = await axiosInstance.post("/auth/login", params);

        if (status === 200) {
            setTokens(data.accessToken, data.refreshToken);
            return { ...data, status: true };
        }

        return { accessToken: "", refreshToken: "", message: data.message || "Login failed", status: false };
    } catch (error: any) {
        console.error("Login error:", error.response?.data || error.message);
        return { accessToken: "", refreshToken: "", message: "Login failed", status: false };
    }
};

export const getUserList = async () => {
    try {
        const { status, data } = await axiosInstance.get("/users");
        if (status === 200) {
            store.dispatch(setUsers(data));
        }
    } catch (error: any) {
        console.error("Get users error:", error.response?.data || error.message);
        return [];
    }
};


export const createUser = async (user: Partial<User>) => {
    try {
        const { data } = await axiosInstance.post("/users", user);
        return { success: true, data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
};

export const updateUserById = async (id: string, user: Partial<User>) => {
    try {
        const { data } = await axiosInstance.put(`/users/${id}`, user);
        return { success: true, data };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
};

export const deleteUserById = async (id: string) => {
    try {
        await axiosInstance.delete(`/users/${id}`);
        return { success: true };
    } catch (err: any) {
        return { success: false, message: err.response?.data?.message || err.message };
    }
};
