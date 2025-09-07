import { create } from "zustand";
import axios from "axios";
import { persist } from "zustand/middleware";

const API_URL = "http://localhost:3000/orders";

axios.defaults.withCredentials = true;

export const useOrderStore = create(
  persist(
    (set, get) => ({
      error: null,
      isLoading: false,
      sellerOrders: [],
      clientOrders: [],

      getSellerOrders: async () => {
        try {
          set({ isLoading: true });
          const response = await axios.get(`${API_URL}/seller-orders`, {
            withCredentials: true,
          });
          set({
            sellerOrders: response.data.data || [],
            isLoading: false,
            error: null,
          });
          return response.data.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.error ||
            error.message ||
            "Error while getting seller orders";
          set({ error: errorMessage, isLoading: false });
        }
      },

      getClientOrders: async () => {
        try {
          set({ isLoading: true });
          const response = await axios.get(`${API_URL}/client-orders`);
          set({
            clientOrders: response.data.data || [],
            isLoading: false,
            error: null,
          });

          return response.data.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.error ||
            error.message ||
            "Error while getting client orders";

          set({ error: errorMessage, isLoading: false });
        }
      },

      updateOrderItemStatus: async (orderId, itemId, newStatus) => {
        try {
          const response = await axios.put(`${API_URL}/order-update`, {
            orderId,
            itemId,
            newStatus,
          });

          // Mettre à jour localement l'état pour éviter de recharger toutes les données
          const updatedOrders = get().sellerOrders.map((order) => {
            if (order._id === orderId) {
              return {
                ...order,
                items: order.items.map((item) => {
                  if (item._id === itemId) {
                    return {
                      ...item,
                      itemStatus: newStatus,
                      // Ajouter deliveredAt si le statut est "delivered"
                      ...(newStatus === "delivered" && {
                        deliveredAt: new Date(),
                      }),
                    };
                  }
                  return item;
                }),
              };
            }
            return order;
          });

          set({ sellerOrders: updatedOrders, isLoading: false });

          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.error ||
            error.message ||
            "Error while updating order's status";

          console.error("Approve error:", errorMessage);
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
    }),
    {
      name: "orders",
    }
  )
);
