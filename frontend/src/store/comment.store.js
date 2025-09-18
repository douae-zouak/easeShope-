import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/sellerReview";
const API_URL_PRODUCT = "http://localhost:3000/productReview";

axios.defaults.withCredentials = true;

export const useCommentStore = create((set, get) => ({
  error: null,
  isLoading: false,
  productReviews: [],
  sellerReviews: [],
  pagination: null,
  stats: null,
  productStats: null,

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

  getProductReviews: async (productId, page = 1, limit = 5) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `${API_URL_PRODUCT}/${productId}?page=${page}&limit=${limit}`,
        {
          withCredentials: true,
        }
      );

      set({
        productReviews: response.data.reviews || [],
        pagination: response.data.pagination,
        productStats: response.data.stats,
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Error while getting product reviews";
      set({ error: errorMessage, isLoading: false });
      return { error: errorMessage };
    }
  },

  addProductReview: async (formData) => {
    try {
      set({ isLoading: true });

      const response = await axios.post(`${API_URL_PRODUCT}/add`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.error) {
        set({ error: response.data.error });
        return { error: response.data.error };
      }

      // Mettre à jour les stats après l'ajout d'un avis
      const { productStats: currentStats } = get();
      const newReview = response.data.productReviews;

      // Recalculer les stats localement (approximation)
      const newStats = currentStats
        ? {
            ...currentStats,
            totalReviews: currentStats.totalReviews + 1,
            averageRating:
              (currentStats.averageRating * currentStats.totalReviews +
                newReview.rating) /
              (currentStats.totalReviews + 1),
            [`${newReview.rating}Stars`]:
              (currentStats[`${newReview.rating}Stars`] || 0) + 1,
          }
        : null;

      set((state) => ({
        productReviews: [newReview, ...state.productReviews],
        productStats: newStats,
        pagination: state.pagination
          ? {
              ...state.pagination,
              totalReviews: state.pagination.totalReviews + 1,
              totalPages: Math.ceil(
                (state.pagination.totalReviews + 1) / state.pagination.limit
              ),
            }
          : null,
        isLoading: false,
        error: null,
      }));

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Error while adding new product review";
      set({ error: errorMessage, isLoading: false });
      return { error: errorMessage };
    }
  },

  deleteProductComment: async (reviewId) => {
    try {
      set({ isLoading: true });
      const response = await axios.delete(
        `${API_URL_PRODUCT}/deleteReview/${reviewId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.error) {
        set({ error: response.data.error });
        return { error: response.data.error };
      }

      // Mettre à jour les stats après la suppression
      const {
        productReviews,
        productStats: currentStats,
        pagination: currentPagination,
      } = get();
      const deletedReview = productReviews.find(
        (review) => review._id === reviewId
      );

      // Recalculer les stats localement (approximation)
      const newStats =
        currentStats && deletedReview
          ? {
              ...currentStats,
              totalReviews: Math.max(0, currentStats.totalReviews - 1),
              averageRating:
                currentStats.totalReviews > 1
                  ? (currentStats.averageRating * currentStats.totalReviews -
                      deletedReview.rating) /
                    (currentStats.totalReviews - 1)
                  : 0,
              [`${deletedReview.rating}Stars`]: Math.max(
                0,
                (currentStats[`${deletedReview.rating}Stars`] || 0) - 1
              ),
            }
          : null;

      set({
        productReviews: productReviews.filter(
          (review) => review._id !== reviewId
        ),
        commentProductId: null,
        productStats: newStats,
        pagination: currentPagination
          ? {
              ...currentPagination,
              totalReviews: Math.max(0, currentPagination.totalReviews - 1),
              totalPages: Math.ceil(
                Math.max(0, currentPagination.totalReviews - 1) /
                  currentPagination.limit
              ),
            }
          : null,
        isLoading: false,
        error: null,
      });

      return { message: response.data.message };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Error while deleting product review";
      set({ error: errorMessage, isLoading: false });
      return { error: errorMessage };
    }
  },
}));
