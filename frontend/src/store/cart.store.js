import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_CART_URL = "http://localhost:3000/cart";

axios.defaults.withCredentials = true;

export const useCartStore = create(
  persist(
    (set) => ({
      isLoading: false,
      error: null,
      cart: [],
      total: 0,
      itemCount: 0,
      seller: null,

      addToCart: async (productId, quantity = 1, selectedVariant) => {
        try {
          const response = await axios.post(`${API_CART_URL}/add`, {
            productId,
            quantity,
            variant: selectedVariant,
          });

          if (response.data.error) {
            set({ error: response.data.error });
            return { error: response.data.error };
          } else {
            set({
              cart: response.data.items || [],
              total: response.data.total || 0,
              itemCount: response.data.itemCount || 0,
              error: null,
              isLoading: false,
            });
            return { cart: response.data.cart };
          }
        } catch (error) {
          let errorMessage = "An error occurred while adding product to cart";

          if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.error || error.message;
          }

          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      getCart: async () => {
        try {
          set({ isLoading: true });
          const response = await axios.get(`${API_CART_URL}`, {
            withCredentials: true,
          });

          set({
            cart: response.data.items || [],
            total: response.data.total || 0,
            itemCount: response.data.itemCount || 0,
            error: null,
            isLoading: false,
          });

          return response.data.items;
        } catch (error) {
          console.error("Error fetching cart:", error);
          let errorMessage = "An error occurred while loading cart";

          if (error.response?.status === 401) {
            errorMessage = "Please login to view your cart";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }

          set({
            cart: [],
            total: 0,
            itemCount: 0,
            error: errorMessage,
            isLoading: false,
          });
          throw new Error(errorMessage);
        }
      },

      updateQuantity: async (productId, quantity, size, colorTitle) => {
        try {
          const response = await axios.put(
            `${API_CART_URL}/update/${productId}`,
            { quantity, size, colorTitle },
            { withCredentials: true }
          );

          // mettre à jour le store avec la réponse backend
          set({
            cart: response.data.items,
            total: response.data.total,
            itemCount: response.data.itemCount,
          });
        } catch (error) {
          const errorMessage =
            error.response?.data?.error || "Failed to update quantity";
          set({ error: errorMessage });
        }
      },

      deleteProductFromCart: async (productId, size, colorTitle) => {
        try {
          const response = await axios.delete(
            `${API_CART_URL}/remove/${productId}`,
            {
              data: { size, colorTitle }, // Envoyer les données dans le body
              withCredentials: true,
            }
          );

          // mettre à jour le store avec la réponse backend
          set({
            cart: response.data.items,
            total: response.data.total,
            itemCount: response.data.itemCount,
          });
        } catch (error) {
          const errorMessage =
            error.response?.data?.error || "Failed to remove product from cart";
          set({ error: errorMessage });
        }
      },
    }),
    {
      name: "cart",
    }
  )
);
