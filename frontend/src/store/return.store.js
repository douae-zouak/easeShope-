import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/returns";

axios.defaults.withCredentials = true;

export const useReturnStore = create((set) => ({
  isLoading: false,
  error: null,

  returnRequest: async (formData) => {
    set({ isLoading: true, error: null });

    console.log("form : ", formData);

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
}));
