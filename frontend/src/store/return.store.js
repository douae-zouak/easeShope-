import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/returns";
const API_ADMIN_URL = "http://localhost:3000/admin/return";
const API_Vendor_URL = "http://localhost:3000/vendor/return";

axios.defaults.withCredentials = true;

export const useReturnStore = create((set) => ({
  isLoading: false,
  error: null,
  ordersRequested: [],
  approvedReturn: [],

  returnRequest: async (formData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/requestReturn`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.error) {
        set({ error: response.data.error, isLoading: false });
        return { error: response.data.error };
      } else {
        set({ isLoading: false });
        return { success: response.data.success };
      }
    } catch (error) {
      let errorMessage =
        "An error occurred while requesting to return a product";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
      }

      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  getReturnProduct: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_ADMIN_URL}/`);

      set({ ordersRequested: response.data.order, isLoading: false });
    } catch (error) {
      let errorMessage =
        "An error occurred while getting return requsted products";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
      }

      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateReturnStatus: async (productId, status, rejectionReason) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.patch(`${API_ADMIN_URL}/update`, {
        productId,
        status,
        rejectionReason,
      });

      set({ ordersRequested: response.data.orders || [], isLoading: false });
      console.log("orders : ", response.data.orders);
    } catch (error) {
      let errorMessage =
        "An error occurred while updating return requsted status";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
      }

      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  getApprovedReturn: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_Vendor_URL}/`);

      set({ approvedReturn: response.data.orders || [], isLoading: false });

      console.log("app : ", response.data.orders);
    } catch (error) {
      let errorMessage =
        "An error occurred while getting approved return requsted products";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
      }

      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
}));
