// store/admin/vendor.store.js
import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/admin/vendor/";

export const useAdminVendorStore = create((set, get) => ({
  vendors: [],
  currentVendor: null,
  loading: false,
  error: null,
  filters: {
    search: "",
    status: "active",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  pagination: {
    page: 1,
    limit: 12,
    totalPages: 1,
    totalVendors: 0,
  },

  // Récupérer tous les vendeurs avec filtres
  getVendors: async (filters = {}) => {
    try {
      set({ loading: true, error: null });

      const currentFilters = get().filters;
      const currentPagination = get().pagination;

      const mergedFilters = { ...currentFilters, ...filters };
      set({ filters: mergedFilters });

      const params = {
        ...mergedFilters,
        page: currentPagination.page,
        limit: currentPagination.limit,
      };

      const response = await axios.get(`${API_URL}`, { params });

      set({
        vendors: response.data.vendors,
        pagination: {
          ...currentPagination,
          totalPages: response.data.totalPages,
          totalVendors: response.data.totalVendors,
        },
        loading: false,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Récupérer les détails d'un vendeur
  getVendorDetails: async (vendorId) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/${vendorId}`);
      set({ currentVendor: response.data.vendor, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Désactiver un vendeur
  desactivateVendor: async (vendorId, reason) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.patch(`${API_URL}/desactivate/${vendorId}`, {
        reason,
      });

      if (response.data.error) {
        set({ error: response.data.error });
        return { error: response.data.error };
      }

      // Mettre à jour la liste des vendeurs
      const vendors = get().vendors.map((vendor) =>
        vendor._id === vendorId
          ? { ...vendor, isActive: false, deactivationReason: reason }
          : vendor
      );

      set({ vendors, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Activer un vendeur
  activateVendor: async (vendorId) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.patch(`${API_URL}/activate/${vendorId}`);

      // Mettre à jour la liste des vendeurs
      const vendors = get().vendors.map((vendor) =>
        vendor._id === vendorId
          ? { ...vendor, isActive: true, deactivationReason: "" }
          : vendor
      );

      set({ vendors, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Supprimer un vendeur
  deleteVendor: async (vendorId, reason) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.delete(`${API_URL}/delete/${vendorId}`, {
        data: { reason },
      });

      // Retirer le vendeur de la liste
      const vendors = get().vendors.filter((vendor) => vendor._id !== vendorId);

      set({
        vendors,
        pagination: {
          ...get().pagination,
          totalVendors: get().pagination.totalVendors - 1,
        },
        loading: false,
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Changer de page
  setPage: (page) => {
    const pagination = { ...get().pagination, page };
    set({ pagination });
    get().getVendors();
  },

  // Mettre à jour les filtres
  setFilters: (filters) => {
    const newFilters = { ...get().filters, ...filters, page: 1 };
    set({ filters: newFilters });
    get().getVendors(newFilters);
  },
}));
