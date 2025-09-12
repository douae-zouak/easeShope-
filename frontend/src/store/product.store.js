import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = "http://localhost:3000/product";
const API_CLIENT_URL = "http://localhost:3000";
const API_PAYMENT_URL = "http://localhost:3000/paypal";

axios.defaults.withCredentials = true;

export const useProductStore = create(
  persist(
    (set) => ({
      uploadedImages: [
        {
          color: "",
          images: [],
        },
      ],
      products: [],
      pagination: null,
      isLoading: false,
      error: null,
      color: "",
      initilLetter: "",
      activeProducts: [],
      discountedProducts: [],
      productCategory: [],
      total: 0,
      order: [],
      seller: null,
      pendingProducts: [],
      pendingPagination: null,
      similarProducts: [],

      getLike: async (id) => {
        try {
          set({ isLoading: true });
          const response = await axios.get(`${API_CLIENT_URL}/getLike/${id}`);

          set({
            similarProducts: response.data.similarProducts,
            isLoading: false,
          });
        } catch (error) {
          const errorMessage =
            error.response?.data?.error || "Error getting like products";

          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      checkout: async (total, items) => {
        try {
          const response = await axios.post(`${API_PAYMENT_URL}/create-order`, {
            total: parseFloat(total),
            items: Array.isArray(items) ? items : [],
          });

          if (!response.data.success) {
            throw new Error(response.data.error || "Payment creation failed");
          }

          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.details ||
            error.message ||
            "Error while payment process";

          console.error("Checkout error:", errorMessage);
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      approve: async (orderId, addressData) => {
        try {
          const response = await axios.post(
            `${API_PAYMENT_URL}/capture-payment/${orderId}`,
            addressData
          );

          if (!response.data.success) {
            throw new Error(response.data.error || "Payment capture failed");
          }

          // ⚡️ Vider le panier local tout de suite
          set((state) => ({
            cart: [],
            order: [...state.order, response.data.order],
          }));
          localStorage.setItem("cart", JSON.stringify([]));

          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.details ||
            error.message ||
            "Error while approving payment";

          console.error("Approve error:", errorMessage);
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      getAllProducts: async (category) => {
        set({ isLoading: true });
        try {
          const response = await axios.get(
            `${API_CLIENT_URL}/get_all_products`
          );
          const products = response.data.products;

          // filtrage si category est défini
          const filteredProducts = category
            ? products.filter((p) => p.category === category)
            : [];

          set({
            products: products,
            activeProducts: products.filter(
              (p) => p.status === "active" && p.discount === 0
            ),
            discountedProducts: products.filter(
              (p) => p.discount && p.discount > 0 && p.status === "active"
            ),
            productCategory: filteredProducts,
            isLoading: false,
          });

          return response.data;
        } catch (error) {
          let errorMessage = "An error occurred while getting products";

          if (axios.isAxiosError(error)) {
            errorMessage =
              error.response?.data?.message ||
              error.response?.statusText ||
              error.message;
          }

          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      deleteImage: async (publicId) => {
        try {
          set({ isLoading: true });
          const response = await axios.delete(
            `${API_URL}/delete_image/${encodeURIComponent(publicId)}`,
            { withCredentials: true }
          );

          // Vérifiez que la réponse est réussie
          if (response.data.success) {
            set((state) => ({
              uploadedImages: state.uploadedImages.map((colorGroup) => ({
                ...colorGroup,
                images: colorGroup.images.filter(
                  (img) => img.public_id !== publicId
                ),
              })),
              isLoading: false,
            }));
          } else {
            throw new Error(response.data.error || "Delete failed");
          }
        } catch (error) {
          console.error("Error deleting image:", error.response?.data || error);
          throw error; // Propager l'erreur pour que handleDelete la capture
        }
      },

      getInitial: (name) => {
        if (!name) return;
        return name.charAt(0).toUpperCase();
      },

      getColor: (name) => {
        const colors = [
          "bg-red-300",
          "bg-blue-300",
          "bg-indigo-300",
          "bg-purple-300",
          "bg-orange-300",
          "bg-pink-300",
          "bg-yellow-300",
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
      },

      getProducts: async (params = {}) => {
        set({ isLoading: true });
        try {
          // Construire les query params
          const queryParams = new URLSearchParams();

          if (params.page) queryParams.append("page", params.page);
          if (params.limit) queryParams.append("limit", params.limit);
          if (params.category) queryParams.append("category", params.category);
          if (params.status) queryParams.append("status", params.status);

          const queryString = queryParams.toString();

          const url = queryString
            ? `${API_URL}/get_products?${queryString}`
            : `${API_URL}/get_products`;

          const response = await axios.get(url);

          set({
            products: response.data.products,
            pagination: response.data.pagination, // Stocker les infos de pagination
            isLoading: false,
          });

          return response.data;
        } catch (error) {
          let errorMessage = "An error occurred while getting products";

          if (axios.isAxiosError(error)) {
            errorMessage =
              error.response?.data?.message ||
              error.response?.statusText ||
              error.message;
          }

          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      AddNewProduct: async ({
        name,
        description,
        gender,
        category,
        originalPrice,
        discount,
        discountType,
        imagesVariant,
        variants,
        status,
      }) => {
        set({ isLoading: true, error: null });

        try {
          const response = await axios.post(`${API_URL}/add_product`, {
            name,
            description,
            gender,
            category,
            originalPrice,
            discount,
            discountType,
            imagesVariant,
            variants,
            status,
          });

          // Reset form after successful submission
          set({
            uploadedImages: [],
            isLoading: false,
          });

          return response.data.product;
        } catch (error) {
          set({
            error:
              error.response?.data?.error ||
              "Error occurred while adding a new product",
            isLoading: false,
          });

          throw new Error(error || error.message);
        }
      },

      uploadImages: async (files, progressCallback, color = "") => {
        set({ isLoading: true, error: null });

        try {
          const formData = new FormData();
          files.forEach((file) => {
            formData.append("images", file);
          });

          // Phase 1: Upload (0-80%)
          let uploadComplete = false;
          const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.lengthComputable && !uploadComplete) {
                const progress = Math.round(
                  (progressEvent.loaded * 80) / progressEvent.total
                );
                progressCallback(progress, "uploading");
              }
            },
          });

          // Phase 2: Simulation du traitement serveur (80-100%)
          uploadComplete = true;
          progressCallback(85, "processing");

          // Attente simulée avec des paliers
          await new Promise((resolve) => setTimeout(resolve, 300));
          progressCallback(90, "processing");

          await new Promise((resolve) => setTimeout(resolve, 300));
          progressCallback(95, "processing");

          const uploadedFiles = response.data;
          const uploadedArray = Array.isArray(uploadedFiles)
            ? uploadedFiles
            : [uploadedFiles];

          // Update both temporary uploadedImages and productData.images

          set((state) => ({
            uploadedImages: [
              ...state.uploadedImages.filter((group) => group.color !== color),
              { color: color, images: uploadedArray },
            ],
            isLoading: false,
          }));

          progressCallback(100, "processing");
          return uploadedArray;
        } catch (error) {
          let errorMessage = "An error occurred while uploading images";

          if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.message || errorMessage;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }

          set({ error: errorMessage });
          throw new Error(errorMessage);
        }
      },

      updateUploadImages: async (images) => {
        set({
          uploadImages: images,
        });
      },

      deleteProduct: async (productId) => {
        set({ isLoading: true });
        try {
          const response = await axios.delete(
            `${API_URL}/delete_product/${productId}`
          );

          set((state) => ({
            products: state.products.filter(
              (product) => product._id !== productId
            ),
            isLoading: false,
            error: null,
          }));

          return response.data;
        } catch (error) {
          let errorMessage = "An error occurred while deleting a product";

          if (axios.isAxiosError(error)) {
            errorMessage =
              error.response?.data?.message ||
              error.response?.statusText ||
              error.message;
          }

          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      updateProduct: async (productId, updateData) => {
        set({ isLoading: true });
        try {
          const response = await axios.put(
            `${API_URL}/edit_product/${productId}`,
            updateData
          );

          // Mettre à jour la liste des produits localement
          set((state) => ({
            products: state.products.map((product) =>
              product._id === productId ? response.data.product : product
            ),
            isLoading: false,
            error: null,
          }));

          return response.data;
        } catch (error) {
          let errorMessage = "Error occured while updateing product";

          if (axios.isAxiosError(error)) {
            errorMessage =
              error.response?.data?.message ||
              error.response?.statusText ||
              error.message;
          }

          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      getProductById: async (productId) => {
        set({ isLoading: true });
        try {
          const response = await axios.get(
            `${API_CLIENT_URL}/get_product/${productId}`
          );

          const productImages = response.data.product.imagesVariant || [];

          const uploadedImages = productImages.map((variant) => ({
            color: variant.color,
            images: variant.images.map((img) => ({
              url: img,
            })),
          }));

          set({
            isLoading: false,
            error: null,
            uploadedImages: uploadedImages,
          });
          return {
            product: response.data.product,
            seller: response.data.seller,
          };
        } catch (error) {
          let errorMessage = "Error while getting a product";

          if (axios.isAxiosError(error)) {
            errorMessage =
              error.response?.data?.message ||
              error.response?.statusText ||
              error.message;
          }

          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // searchProducts: async (query) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     const response = await axios.get(`${API_URL}/search`, {
      //       params: { query }, // ?query=searchTerm
      //     });

      //     set({
      //       products: response.data.products,
      //       activeProducts: response.data.products.filter(
      //         (p) => p.status === "active" && p.discount === 0
      //       ),
      //       discountedProducts: response.data.products.filter(
      //         (p) => p.discount && p.discount > 0 && p.status === "active"
      //       ),

      //       isLoading: false,
      //     });
      //   } catch (err) {
      //     set({ error: err.message, isLoading: false });
      //   }
      // },

      searchProducts: async (query) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.get(`${API_URL}/search`, {
            params: { query }, // ?query=searchTerm
          });

          set({
            products: response.data.products,
            activeProducts: response.data.products.filter(
              (p) => p.status === "active" && p.discount === 0
            ),
            discountedProducts: response.data.products.filter(
              (p) => p.discount && p.discount > 0 && p.status === "active"
            ),

            isLoading: false,
          });
        } catch (err) {
          set({ error: err.message, isLoading: false });
        }
      },

      getPendingProducts: async (page = 1, limit = 10) => {
        set({ isLoading: true });
        try {
          const response = await axios.get(
            `${API_CLIENT_URL}/admin/pending-products?page=${page}&limit=${limit}`,
            { withCredentials: true }
          );

          set({
            pendingProducts: response.data.products,
            pendingPagination: response.data.pagination,
            isLoading: false,
            error: null,
          });

          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.error ||
            "Erreur lors de la récupération des produits en attente";
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      getAdminProductDetails: async (productId) => {
        set({ isLoading: true });
        try {
          const response = await axios.get(
            `
      ${API_CLIENT_URL}/admin/product/${productId}`,
            { withCredentials: true }
          );

          set({ isLoading: false, error: null });
          return response.data.product;
        } catch (error) {
          const errorMessage =
            error.response?.data?.error ||
            "Erreur lors de la récupération des détails du produit";
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      approveProduct: async (productId) => {
        set({ isLoading: true });
        try {
          const response = await axios.put(
            `${API_CLIENT_URL}/admin/approve-product/${productId}`,
            {},
            { withCredentials: true }
          );

          // Mettre à jour la liste des produits en attente
          set((state) => ({
            pendingProducts: state.pendingProducts.filter(
              (p) => p._id !== productId
            ),
            isLoading: false,
            error: null,
          }));

          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.error ||
            "Erreur lors de l'approbation du produit";
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      rejectProduct: async (productId, rejectionReason) => {
        set({ isLoading: true });
        try {
          const response = await axios.put(
            `${API_CLIENT_URL}/admin/reject-product/${productId}`,
            { rejectionReason },
            { withCredentials: true }
          );

          // Mettre à jour la liste des produits en attente
          set((state) => ({
            pendingProducts: state.pendingProducts.filter(
              (p) => p._id !== productId
            ),
            isLoading: false,
            error: null,
          }));

          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.error || "Erreur lors du rejet du produit";
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },
    }),
    {
      name: "product-storage",
    }
  )
);
