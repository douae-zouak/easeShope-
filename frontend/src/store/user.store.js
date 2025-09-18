import { create } from "zustand";
import axios from "axios";
import { createJSONStorage, persist } from "zustand/middleware";

const API_URL = "http://localhost:3000";

axios.defaults.withCredentials = true;

export const useUserStore = create(
  persist(
    (set) => ({
      error: null,
      isLoading: false,
      seller: [],
      sellerActiveProducts: [],
      sellerExperience: "1 day",
      commentId: null,
      commentProductId: null,
      orderedProductId: null,

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

          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      getSellerActiveProducts: async (sellerId) => {
        try {
          set({ isLoading: true });
          const response = await axios.get(
            `${API_URL}/getSellerActiveProducts/${sellerId}`
          );

          set({
            sellerActiveProducts: response.data.activatedSellerProducts,
            isLoading: false,
          });
        } catch (error) {
          let errorMessage =
            "An error occurred while getting seller active products";

          if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.error || error.message;
          }

          set({ error: errorMessage, isLoading: false });
          throw Error(errorMessage);
        }
      },

      getSellerExperience: async (sellerId) => {
        try {
          set({ isLoading: true });
          const response = await axios.get(
            `${API_URL}/getSellerExperience/${sellerId}`
          );

          set({
            sellerExperience: response.data.experience,
            isLoading: false,
          });
        } catch (error) {
          let errorMessage =
            "An error occurred while getting seller experiences";

          if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.error || error.message;
          }

          set({ error: errorMessage, isLoading: false });
          throw Error(errorMessage);
        }
      },

      commented: async (sellerId) => {
        try {
          set({ isLoading: true });
          const response = await axios.get(
            `${API_URL}/didCommented/${sellerId}`
          );

          set({
            commentId: response.data.commentId,
            isLoading: false,
          });
        } catch (error) {
          let errorMessage = "An error occurred while getting comment ID";

          if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.error || error.message;
          }

          set({ error: errorMessage, isLoading: false });
          throw Error(errorMessage);
        }
      },

      orderedProduct: async (productId) => {
        try {
          set({ isLoading: true });
          const response = await axios.get(
            `${API_URL}/didOrderedProduct/${productId}`
          );

          if (!response.data.error) {
            set({
              orderedProductId: response.data.orderedProductId,
              isLoading: false,
            });
          }
        } catch (error) {
          let errorMessage = "An error occurred while checking is ordered";

          if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.error || error.message;
          }

          set({ error: errorMessage, isLoading: false });
          throw Error(errorMessage);
        }
      },

      commentedProduct: async (productId) => {
        try {
          set({ isLoading: true });
          const response = await axios.get(
            `${API_URL}/didCommentedProduct/${productId}`
          );

          set({
            commentProductId: response.data.commentId,
            isLoading: false,
          });
        } catch (error) {
          let errorMessage = "An error occurred while getting comment ID";

          if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.error || error.message;
          }

          set({ error: errorMessage, isLoading: false });
          throw Error(errorMessage);
        }
      },
    }),
    {
      name: "seller",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
