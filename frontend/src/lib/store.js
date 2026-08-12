import { create } from "zustand";
import client from "@/api/client";

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("tc_token") || null,
  loading: true,

  setAuth: (token, user) => {
    localStorage.setItem("tc_token", token);
    set({ token, user, loading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("tc_token");
    if (!token) {
      set({ user: null, token: null, loading: false });
      return;
    }
    try {
      const res = await client.get("/auth/me");
      set({ user: res.data, token, loading: false });
    } catch (e) {
      localStorage.removeItem("tc_token");
      set({ user: null, token: null, loading: false });
    }
  },

  updateUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem("tc_token");
    set({ user: null, token: null });
  },
}));
