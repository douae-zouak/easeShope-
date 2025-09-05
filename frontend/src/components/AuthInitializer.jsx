// components/AuthInitializer.jsx
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth.store";
// import LoadingSpinner from "./LoadingSpinner"; // Créez ce composant si nécessaire

const AuthInitializer = ({ children }) => {
  const { checkAuth, logout } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        if (error.response?.data?.shouldLogout) {
          await logout();
        }
      } finally {
        setIsInitialized(true);
      }
    };
    initializeAuth();
  }, []);

  // 🔹 Ne rien rendre tant que l'auth n'est pas initialisée
  if (!isInitialized) return <div>Loading...</div>;

  return children;
};

// const AuthInitializer = ({ children }) => {
//   const { checkAuth, logout, isAuthenticated } = useAuthStore();
//   const [isInitialized, setIsInitialized] = useState(false);

//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         await checkAuth();
//       } catch (error) {
//         console.error("Initial auth check failed:", error);

//         // Handle 401 specifically - force logout
//         if (error.response?.status === 401 || error.status === 401) {
//           const shouldLogout = error.response?.data?.shouldLogout;
//           if (shouldLogout) {
//             await logout(); // Clear client-side state
//           }
//         }
//       } finally {
//         setIsInitialized(true);
//       }
//     };

//     initializeAuth();
//   }, [checkAuth, logout]);

//   //   if (!isInitialized) {
//   //     return <LoadingSpinner fullScreen />;
//   //   }

//   return children;
// };

export default AuthInitializer;
