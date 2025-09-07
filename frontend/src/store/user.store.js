import { create } from "zustand";
import axios from "axios";
import { persist } from "zustand/middleware";

const API_URL = "http://localhost:3000";

axios.defaults.withCredentials = true;

export const useUserStore = create(
  persist(
    (set) => ({
      error: null,
      isLoading: false,
      seller: [],

      getSellerById: async (userId) => {
        try {
          set({ isLoading: true });
          const response = await axios.get(`${API_URL}/seller/${userId}`);
          set({
            seller: response.data.seller || [],
            isLoading: false,
            error: null,
          });
          return response.data.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.error ||
            error.message ||
            "Error while getting seller infos";

          console.error("Approve error:", errorMessage);
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
    }),
    {
      name: "seller",
    }
  )
);
