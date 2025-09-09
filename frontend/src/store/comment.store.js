import { create } from "zustand";
import axios from "axios";
import { persist } from "zustand/middleware";

const API_URL = "http://localhost:3000/sellerReview";
const API_URL_PRODUCT = "http://localhost:3000/productReview";

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

    deleteComment: async (reviewId) => {
      try {
        set({ isLoading: true });
        const response = await axios.delete(
          `${API_URL}/deleteReview/${reviewId}`
        );

        if (response.data.error) {
          set({ error: response.data.error });
          return { error: response.data.error };
        }

        set({
          sellerReviews: response.data.reviews,
          isLoading: false,
          error: null,
        });

        return { message: response.data.message };
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Error while adding new seller review";
        set({ error: errorMessage, isLoading: false });
      }
    },

    getProductReviews: async (productId) => {
      try {
        set({ isLoading: true });
        const response = await axios.get(`${API_URL_PRODUCT}/${productId}`, {
          withCredentials: true,
        });
        set({
          productReviews: response.data.reviews || [],
          pagination: response.data.pagination,
          stats: response.data.stats,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Error while getting product reviews";
        set({ error: errorMessage, isLoading: false });
      }
    },

    addProductReview: async (productId, rating, comment) => {
      try {
        set({ isLoading: true });
        const response = await axios.post(
          `${API_URL_PRODUCT}/add`,
          {
            productId,
            rating,
            comment,
          },
          {
            withCredentials: true,
          }
        );

        if (response.data.error) {
          set({ error: response.data.error });
          return { error: response.data.error };
        }

        set((state) => ({
          productReviews: [
            ...state.productReviews,
            response.data.productReviews,
          ],
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Error while adding new product review";
        set({ error: errorMessage, isLoading: false });
      }
    },

    deleteProductComment: async (reviewId) => {
      try {
        set({ isLoading: true });
        const response = await axios.delete(
          `${API_URL_PRODUCT}/deleteReview/${reviewId}`
        );

        if (response.data.error) {
          set({ error: response.data.error });
          return { error: response.data.error };
        }

        set({
          productReviews: response.data.reviews,
          isLoading: false,
          error: null,
        });

        return { message: response.data.message };
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
