import { create } from "zustand";
import axios from "axios";

const API_ADMIN_URL = "http://localhost:3000/admin/stats";
const API_VENDOR_URL = "http://localhost:3000/vendor/stats";

axios.defaults.withCredentials = true;

export const useStatStore = create((set) => ({
  isLoading: false,
  error: null,
  stats: {
    totalProducts: 0,
    activeProducts: 0,
    pendingProducts: 0,
    totalSellers: 0,
    activeSellers: 0,
    newSellers: 0,
    totalSales: 0,
    totalRevenue: 0,
  },
  chartData: [],
  topSellers: [],

  vendorStats: {
    activeProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  },
  vendorChartData: {
    sales: [],
    categories: [],
  },
  recentOrders: [],
  performance: {},

  getAdminStats: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_ADMIN_URL}/`);

      set({
        stats: response.data.stats,
        chartData: response.data.chartData,
        topSellers: response.data.topSellers,
        isLoading: false,
      });
    } catch (error) {
      let errorMessage = "An error occurred while getting admin stats";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
      }

      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  getVendorStats: async (timeRange = "30d") => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_VENDOR_URL}?range=${timeRange}`);

      set({
        vendorStats: response.data.stats,
        vendorChartData: response.data.chartData,
        recentOrders: response.data.recentOrders,
        performance: response.data.performance,
        isLoading: false,
      });
    } catch (error) {
      let errorMessage = "Error occured while getting vendor stats";

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message;
      }

      set({
        error: errorMessage,
        isLoading: false,
        vendorStats: {
          activeProducts: 0,
          totalSales: 0,
          totalRevenue: 0,
          totalCustomers: 0,
        },
        vendorChartData: {
          sales: [],
          categories: [],
        },
        recentOrders: [],
        performance: {},
      });
    }
  },
}));
