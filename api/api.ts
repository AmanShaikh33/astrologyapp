import axios from "axios";

const API_URL = "http://192.168.0.174:5000/api"; // Replace with your backend URL
// const API_URL = "http://localhost:5000/api"; // For iOS simulator

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ AUTH
export const apiRegister = async (data: any) => {
  try {
    const res = await api.post("/auth/register", data);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const apiLogin = async (data: any) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data; // { token: string, user: {...} }
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const apiGetMe = async (token: string) => {
  try {
    const res = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // returns user object
  } catch (error: any) {
    throw error.response?.data || { message: "Fetching user failed" };
  }
};

/* ------------------- ASTROLOGER APIs ------------------- */

// Create profile (with optional profilePic)
export const apiCreateProfile = async (token: string, formData: FormData) => {
  try {
    const res = await api.post("/astrologers/profile", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Create profile failed" };
  }
};

// Get my profile
export const apiGetMyProfile = async (token: string) => {
  try {
    const res = await api.get("/astrologers/my-profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Get my profile failed" };
  }
};

// Update profile
export const apiUpdateProfile = async (token: string, formData: FormData) => {
  try {
    const res = await api.put("/astrologers/profile", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Update profile failed" };
  }
};

// Delete profile
export const apiDeleteProfile = async (token: string) => {
  try {
    const res = await api.delete("/astrologers/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Delete profile failed" };
  }
};

// Update availability
export const apiUpdateAvailability = async (token: string, availability: "online" | "offline") => {
  try {
    const res = await api.put("/astrologers/status", { availability }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Update availability failed" };
  }
};

// Get all astrologers with optional filters
export const apiGetAllAstrologers = async (token: string, filters?: {
  skills?: string;
  languages?: string;
  priceMin?: number;
  priceMax?: number;
  availability?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const res = await api.get("/astrologers", {
      headers: { Authorization: `Bearer ${token}` },
      params: filters,
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Get all astrologers failed" };
  }
};

export default api;
