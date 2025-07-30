// src/context/ShopContext.jsx
import React, { createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  const currency = "$";
  const delivery_charges = 5;
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Custom axios instance with interceptors
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: backendUrl,
      withCredentials: true
    });

    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          token
        ) {
          originalRequest._retry = true;
          try {
            const refreshRes = await axios.post(
              `${backendUrl}/api/user/refresh-token`,
              {},
              { withCredentials: true }
            );
            if (refreshRes.data.success) {
              setToken(refreshRes.data.accessToken);
              originalRequest.headers.Authorization = `Bearer ${refreshRes.data.accessToken}`;
              return axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            logout();
            toast.error("Session expired. Please log in again.");
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [token]);

  const getProductsData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setBooks(res.data.products);
      } else {
        setFetchError("No products found.");
      }
    } catch (err) {
      console.error("Product fetch error:", err.message);
      setFetchError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  const addToCart = async (productId) => {
    if (!user?._id) return toast.error("Login first to add to cart");

    try {
      const res = await axiosInstance.post(`/api/cart/add`, {
        userId: user._id,
        productId,
      });

      if (res.data.success) {
        setCartItems((prev) => ({
          ...prev,
          [productId]: (prev[productId] || 0) + 1,
        }));
        toast.success("Added to cart");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Error adding item to cart");
    }
  };

  const updateQuantity = (productId, qty) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (qty <= 0) delete updated[productId];
      else updated[productId] = qty;
      return updated;
    });
  };

  const getCartCount = () =>
    Object.values(cartItems).reduce((sum, count) => sum + count, 0);

  const getCartAmount = () =>
    Object.entries(cartItems).reduce((sum, [id, qty]) => {
      const book = books.find((b) => b._id === id);
      return book ? sum + book.price * qty : sum;
    }, 0);

  const syncCartFromBackend = async () => {
    if (!user?._id || !token) return;
    try {
      const res = await axiosInstance.get(`/api/cart/get?userId=${user._id}`);
      if (res.data.success) {
        const formatted = {};
        res.data.cart.forEach((item) => {
          if (item?.productId?._id)
            formatted[item.productId._id] = item.quantity;
        });
        setCartItems(formatted);
      }
    } catch (err) {
      console.error("Cart sync failed:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!token || !user) return;
      try {
        const res = await axios.post(
          `${backendUrl}/api/user/refresh-token`,
          {},
          { withCredentials: true }
        );
        if (res.data?.accessToken) {
          setToken(res.data.accessToken);
        }
      } catch (err) {
        console.error("Auto refresh failed", err);
      }
    }, 4 * 60 * 1000); 

    return () => clearInterval(interval);
  }, [token, user]);

  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/api/user/logout`, null, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }

    setToken(null);
    setUser(null);
    setCartItems({});
    localStorage.clear();
    toast.success("Logged out");
    navigate("/login");
  };

  const contextValue = useMemo(
    () => ({
      books,
      loading,
      fetchError,
      getProductsData,
      currency,
      delivery_charges,
      cartItems,
      setCartItems,
      addToCart,
      updateQuantity,
      getCartCount,
      getCartAmount,
      backendUrl,
      token,
      setToken,
      user,
      setUser,
      logout,
      navigate,
    }),
    [books, loading, fetchError, cartItems, token, user]
  );

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
