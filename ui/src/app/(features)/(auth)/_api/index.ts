import axiosClient from "@/_api/axiosClient";

interface LoginBody {
  email: string;
  password: string;
}

interface LoginResponse {
  tokens: {
    access: string;
    refresh: string;
  };
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export const loginUser = async (body: LoginBody): Promise<LoginResponse> => {
  const response = await axiosClient.post("api/login", body);
  return response.data;
};

export const registerUser = async (body: { username: string; email: string; password: string }) => {
  const response = await axiosClient.post(`api/register/`, body);
  return response.data;
};

export const refreshAccessTokenFn = async (refresh: string): Promise<LoginResponse> => {
  const response = await axiosClient.post("api/login/refresh/", { refresh });
  return response.data;
};
