// context/ShopContext.jsx
import React, { createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "$";
  const delivery_charges = 5;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Token from localStorage
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (e) {
      return {};
    }
  });
  
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);
  

  // Sync token & user to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/api/user/logout`, null, {
        withCredentials: true,
      });

      setToken(null);
      setUser(null);
      setCartItems({});
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      

      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setToken(null);
      setUser(null);
      setCartItems({});
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");

      toast.error("Something went wrong. You were logged out locally.");
      navigate("/login");
    }
  };

  // Cart logic
  const addToCart = async (productId) => {
    if (!user?._id) {
      toast.error("You must be logged in to add items to your cart.");
      return;
    }

    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/add`,
        {
          userId: user._id,
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // token from localStorage or auth context
          },
        }
      );

      if (res.data.success) {
        const updated = { ...cartItems };
        updated[productId] = (updated[productId] || 0) + 1;
        setCartItems(updated);
        toast.success("Item added to cart");
      } else {
        toast.error(res.data.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Something went wrong while adding to cart");
    }
  };
  
  // Right after login or on first load (if user is logged in), call this function
  const syncCartFromBackend = async () => {
    if (!user?._id) return;

    try {
      const res = await axios.get(
        `${backendUrl}/api/cart/get?userId=${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const backendCart = res.data.cart;

        const formattedCart = {};
        backendCart.forEach((item) => {
          if (item?.productId?._id) {
            formattedCart[item.productId._id] = item.quantity;
          }
        });

        setCartItems(formattedCart);
      }
    } catch (error) {
      console.error("Cart sync failed:", error);
    }
  };
  
  useEffect(() => {
    if (user && token) {
      syncCartFromBackend();
    }
  }, [user, token]);
  
  const syncLocalCartToBackend = async () => {
    if (!user || !token || !Object.keys(cartItems).length) return;

    try {
      // Prepare cart for backend [{ productId, quantity }]
      const cartArray = Object.entries(cartItems).map(
        ([productId, quantity]) => ({
          productId,
          quantity,
        })
      );

      const res = await axios.post(
        `${backendUrl}/api/cart/sync`,
        {
          userId: user._id,
          cartItems: cartArray,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        const syncedCart = {};
        res.data.cart.forEach((item) => {
          if (item?.productId) {
            syncedCart[item.productId] = item.quantity;
          }
        });

        setCartItems(syncedCart);
        localStorage.removeItem("cart"); 
        toast.success("Cart synced!");
      }
    } catch (err) {
      console.error("Cart sync failed:", err);
    }
  };

  useEffect(() => {
    const autoSyncCart = async () => {
      if (user && token) {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          try {
            const cartData = JSON.parse(storedCart);
            const cartArray = Object.entries(cartData).map(
              ([productId, quantity]) => ({
                productId,
                quantity,
              })
            );

            const res = await axios.post(
              `${backendUrl}/api/cart/sync`,
              { userId: user._id, cartItems: cartArray },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
              const syncedCart = {};
              res.data.cart.forEach((item) => {
                if (item?.productId) {
                  syncedCart[item.productId] = item.quantity;
                }
              });
              setCartItems(syncedCart);
              localStorage.removeItem("cart");
              // toast.success("Cart auto-synced!");
            }
          } catch (err) {
            console.error("Auto sync failed:", err);
          }
        }
      }
    };

    autoSyncCart();
  }, [user, token]);
  
  

  const updateQuantity = (productId, newQty) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (newQty <= 0) {
        delete updated[productId];
      } else {
        updated[productId] = newQty;
      }
      return updated;
    });
  };
  

  const getCartCount = () => {
    return Object.values(cartItems).reduce((acc, count) => acc + count, 0);
  };

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((acc, [id, qty]) => {
      const item = books.find((book) => book._id === id);
      return item ? acc + item.price * qty : acc;
    }, 0);
  };

  // Fetch books from backend
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

  const value = useMemo(
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

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
