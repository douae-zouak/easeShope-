import { create } from "zustand";
import axios from "axios";
import { persist } from "zustand/middleware";

const API_URL = "http://localhost:3000/sellerReview";

axios.defaults.withCredentials = true;

export const useCommentStore = create(
  persist((set) => ({
    error: null,
    isLoading: false,
    productReviews: [],
    sellerReviews: [],
    pagination: null,
    stats: null,

    getSellerReviews: async (sellerId) => {
      try {
        set({ isLoading: true });
        const response = await axios.get(`${API_URL}/${sellerId}`, {
          withCredentials: true,
        });
        set({
          sellerReviews: response.data.reviews || [],
          pagination: response.data.pagination,
          stats: response.data.stats,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Error while getting seller reviews";
        set({ error: errorMessage, isLoading: false });
      }
    },

    addSellerReview: async (sellerId, rating, comment) => {
      try {
        set({ isLoading: true });
        const response = await axios.post(
          `${API_URL}/add`,
          {
            sellerId,
            rating,
            comment,
          },
          {
            withCredentials: true,
          }
        );

        console.log(response);

        if (response.data.error) {
          set({ error: response.data.error });
          return response.data.error;
        }

        set((state) => ({
          sellerReviews: [...state.sellerReviews, response.data.sellerReview],
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Error while adding new seller review";
        set({ error: errorMessage, isLoading: false });
      }
    },
  }))
);
