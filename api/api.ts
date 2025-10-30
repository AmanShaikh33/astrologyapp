import axios from "axios";

const API_URL = "https://astrologyapp-1.onrender.com/api";
 
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
    return res.data; 
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const apiGetMe = async (token: string) => {
  try {
    const res = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; 
  } catch (error: any) {
    throw error.response?.data || { message: "Fetching user failed" };
  }
};


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

export const apiGetPendingAstrologers = async (token: string) => {
  try {
    const res = await api.get("/admin/astrologers/pending", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // { success, count, astrologers }
  } catch (error: any) {
    throw error.response?.data || { message: "Get pending astrologers failed" };
  }
};


export const apiApproveAstrologer = async (token: string, id: string) => {
  try {
    const res = await api.put(`/admin/astrologers/approve/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; 
  } catch (error: any) {
    throw error.response?.data || { message: "Approve astrologer failed" };
  }
};


export const apiRejectAstrologer = async (token: string, id: string) => {
  try {
    const res = await api.delete(`/admin/astrologers/reject/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; 
  } catch (error: any) {
    throw error.response?.data || { message: "Reject astrologer failed" };
  }
};

export const apiGetAstrologersWithFilter = async (token: string, status?: "pending" | "approved") => {
  try {
    const res = await api.get("/admin/astrologers", {
      headers: { Authorization: `Bearer ${token}` },
      params: { status },
    });
    return res.data; 
  } catch (error: any) {
    throw error.response?.data || { message: "Get astrologers with filter failed" };
  }
};


export const apiGetApprovedAstrologers = async () => {
  try {
    const res = await api.get("/astrologers/approved"); 
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Get approved astrologers failed" };
  }
};

export const apiAdminDeleteAstrologer = async (token: string, id: string) => {
  try {
    const res = await api.delete(`/astrologers/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Delete astrologer failed" };
  }
};




export default api;
