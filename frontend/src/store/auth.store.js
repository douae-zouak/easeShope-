import { create } from "zustand";
import axios from "axios";
import { createJSONStorage, persist } from "zustand/middleware";

const API_URL = "http://localhost:3000/auth";
const PROFILE_API_URL = "http://localhost:3000/profile";

axios.defaults.withCredentials = true;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, user = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(user);
    }
  });
  failedQueue = [];
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      message: null,
      isCheckingAuth: false,

      uploadProfilePhoto: async (formData) => {
        try {
          const response = await axios.post(
            `${PROFILE_API_URL}/upload-photo`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          set((state) => ({
            user: {
              ...state.user,
              profilePhoto: response.data.profilePhotoUrl,
            },
          }));

          return response.data.profilePhotoUrl;
        } catch (error) {
          set({ error: error.response?.data?.message || error.message });
          throw error;
        }
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.put(
            `${PROFILE_API_URL}/profile`,
            profileData
          );

          set({ user: response.data.user, isLoading: false });

          return response.data;
        } catch (error) {
          const errorMsg = error.response?.data?.message || "Update failed";
          set({ error: errorMsg, isLoading: false });
          throw new Error(errorMsg);
        }
      },

      signup: async (fullName, email, password, confirmPassword, role) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/signin`, {
            fullName,
            email,
            password,
            confirmPassword,
            role,
          });

          set({ user: response.data.user, isLoading: false });
        } catch (error) {
          set({
            error: error.response?.data?.error || "An error occurred",
            isLoading: false,
          });
          throw error;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/login`, {
            email,
            password,
          });

          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });

          return response.data.user;
        } catch (error) {
          set({
            error: error.response?.data?.error || "Login failed",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await axios.post(`${API_URL}/logout`);
          set({ user: null, isAuthenticated: false, isLoading: false });
          localStorage.removeItem("user");
          localStorage.removeItem("orders");
          localStorage.removeItem("cart");
          localStorage.removeItem("seller");
          localStorage.removeItem("product-storage");
          localStorage.removeItem("favorites");
        } catch (error) {
          set({ error: "Error logging out", isLoading: false });
          throw error;
        }
      },

      verifyEmail: async (verificationCode) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/verify-email`, {
            verificationCode,
          });
          set({ user: response.data.user, isLoading: false });
          return response.data;
        } catch (error) {
          set({
            error: error.response?.data?.message || "Error verifying email",
            isLoading: false,
          });
          throw error;
        }
      },

      resendVerificationCode: async (email) => {
        set({ isLoading: true, error: null, message: null });
        try {
          const response = await axios.post(`${API_URL}/resend-verification`, {
            email,
          });
          set({ message: response.data.message, isLoading: false });
        } catch (error) {
          set({
            error:
              error.response?.data?.error ||
              "Error resending verification code",
            isLoading: false,
          });
          throw error;
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            `${API_URL}/request-password-reset`,
            {
              email,
            }
          );
          set({ message: response.data.message, isLoading: false });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Error sending reset email",
            isLoading: false,
          });
          throw error;
        }
      },

      resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(
            `${API_URL}/reset-password/${token}`,
            {
              password,
            }
          );
          set({ message: response.data.message, isLoading: false });
        } catch (error) {
          set({
            error: error.response?.data?.message || "Error resetting password",
            isLoading: false,
          });
          throw error;
        }
      },

      // 🔑 Vérification de session au démarrage
      checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
          const res = await axios.get(`${API_URL}/check-session`, {
            withCredentials: true,
          });
          set({
            user: res.data.user,
            isAuthenticated: res.data.isAuthenticated,
            isCheckingAuth: false,
          });
          // eslint-disable-next-line no-unused-vars
        } catch (err) {
          set({ user: null, isAuthenticated: false, isCheckingAuth: false });
        }
      },

      // Interceptor Axios pour rafraîchir automatiquement les tokens

      setupAxiosInterceptors: () => {
        console.log("intercepter installed");

        axios.interceptors.response.use(
          (response) => response,
          async (error) => {
            const originalRequest = error.config;

            // Éviter les boucles infinies - si c'est déjà la requête de refresh
            // “Si l’erreur vient déjà d’un appel /refresh, je ne tente pas un refresh dessus.”
            if (originalRequest.url?.includes("/refresh")) {
              return Promise.reject(error);
            }

            // Si le token est expiré → on tente le refresh
            if (error.response?.status === 401 && !originalRequest._retry) {
              originalRequest._retry = true;

              if (isRefreshing) {
                // Attendre le refresh déjà en cours
                return new Promise((resolve, reject) => {
                  failedQueue.push({
                    resolve: () => resolve(axios(originalRequest)),
                    reject,
                  });
                });
              }

              isRefreshing = true;

              try {
                const response = await axios.get(`${API_URL}/refresh`, {
                  withCredentials: true,
                });

                console.log("refreshed in axios successfully!!!");

                set({
                  user: response.data.user,
                  isAuthenticated: true,
                });

                processQueue(null, response.data.user);

                return axios(originalRequest);
              } catch (refreshError) {
                console.error("Refresh token invalid → logout");

                set({ user: null, isAuthenticated: false });

                document.cookie =
                  "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie =
                  "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                processQueue(refreshError, null);
                return Promise.reject(refreshError);
              } finally {
                isRefreshing = false;
              }
            }

            return Promise.reject(error);
          }
        );
      },
    }),
    {
      name: "user", // clé
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
