import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_FAVORITE_URL = "http://localhost:3000/favorite";

axios.defaults.withCredentials = true;

export const useFavoriteStore = create(
  persist(
    (set) => ({
      isLoading: false,
      error: null,
      favorites: [],

      toggleToFavorite: async (productId) => {
        try {
          const response = await axios.post(`${API_FAVORITE_URL}/toggle`, {
            productId,
          });

          if (response.data.error) {
            set({
              error:
                response.data.error ||
                "Error occured while adding product to favorite",
            });
            return { error: response.data.error };
          }

          set((state) => {
            if (response.data.isFavorite) {
              return {
                favorites: [...state.favorites, response.data.data],
              };
            } else {
              return {
                favorites: state.favorites.filter((fav) => {
                  const favProductId = fav.productId?._id || fav._id;
                  return favProductId !== productId;
                }),
              };
            }
          });

          return {
            success: true,
            message: response.data.message,
            isFavorite: response.data.isFavorite,
          };
        } catch (error) {
          let errorMessage =
            "An error occurred while adding product to favorite";

          if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.error || error.message;
          }

          set({ error: errorMessage, isLoading: false });
          throw Error(errorMessage);
        }
      },

      getFavorites: async () => {
        try {
          const response = await axios.get(`${API_FAVORITE_URL}/`);

          set({ favorites: response.data.data });
        } catch (error) {
          let errorMessage = "An error occurred while getting favorites";

          if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.error || error.message;
          }

          set({ error: errorMessage, isLoading: false });
          throw Error(errorMessage);
        }
      },
    }),
    {
      name: "favorites",
    }
  )
);
