import React, { createContext, useState, useContext, useEffect } from "react";
import buzzar_api from "../config/api-config";
import { useNavigate } from "react-router-dom";

// AuthContext
const AuthContext = createContext();

// Categories Data
const categories = [
  { label: "Fashion & Apparel", value: "Fashion & Apparel" },
  { label: "Food & Beverages", value: "Food & Beverages" },
  { label: "Books & Stationary", value: "Books & Stationary" },
  { label: "Gadgets & Electronics", value: "Gadgets & Electronics" },
  { label: "Arts & Crafts", value: "Arts & Crafts" },
  { label: "Health & Wellness", value: "Health & Wellness" },
  { label: "Home & Living", value: "Home & Living" },
  { label: "Services", value: "Services" },
  { label: "Sports & Recreation", value: "Sports & Recreation" },
  { label: "Events & Tickets", value: "Events & Tickets" },
];

// Utility function to initialize state from localStorage
const loadFromLocalStorage = (key) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : null;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // State initialization
  const [user, setUser] = useState(() => loadFromLocalStorage("user"));
  const [authTokens, setAuthTokens] = useState(() =>
    loadFromLocalStorage("tokens")
  );
  const [vendorData, setVendorData] = useState(() =>
    loadFromLocalStorage("vendorData")
  );
  const [customerData, setCustomerData] = useState(() =>
    loadFromLocalStorage("customerData")
  );
  const [loading, setLoading] = useState(false);

  // Sync state changes with localStorage
  useEffect(() => {
    const syncWithLocalStorage = (key, value) => {
      value
        ? localStorage.setItem(key, JSON.stringify(value))
        : localStorage.removeItem(key);
    };
    syncWithLocalStorage("user", user);
    syncWithLocalStorage("tokens", authTokens);
    syncWithLocalStorage("vendorData", vendorData);
    syncWithLocalStorage("customerData", customerData);
  }, [user, authTokens, vendorData, customerData]);

  // Refactored fetchUserData to accept accessToken as a parameter
  const fetchUserData = async (id, page, accessToken) => {
    try {
      const endpoint =
        page === "vendor" ? `/vendors/${id}/` : `/customers/${id}/`;

      // Set the Authorization header directly in the request
      const response = await buzzar_api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data; // Return the fetched user data
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
    }
  };

  const login = async (data, page) => {
    setLoading(true);
    try {
      const response = await buzzar_api.post("/login/", data);
      const tokens = {
        access: response.data.access,
        refresh: response.data.refresh,
      };
      const userData = response.data.user;

      // Set auth tokens and user state immediately
      setAuthTokens(tokens);
      setUser(userData);

      // Fetch vendor and customer data using the access token
      if (page === "vendor" && userData.is_vendor) {
        const [vendorDetail, customerDetail] = await Promise.all([
          fetchUserData(userData.id, "vendor", tokens.access),
          fetchUserData(userData.id, "customer", tokens.access),
        ]);

        setVendorData(vendorDetail);
        setCustomerData({
          customer_id: customerDetail.customer_id,
          saved_cart_id: customerDetail.saved_cart_id,
        });

        navigate("/vendor/dashboard");
      } else if (page === "customer") {
        const customerDetail = await fetchUserData(
          userData.id,
          "customer",
          tokens.access
        );

        setCustomerData({
          customer_id: customerDetail.customer_id,
          saved_cart_id: customerDetail.saved_cart_id,
        });

        navigate("/");
      } else if (
        page === "admin" &&
        userData.email === "buzzaradmin@example.com"
      ) {
        navigate("/admin/dashboard");
      } else {
        if (page === "admin") {
          alert("Access denied. This login page is only for admin");
        } else {
          alert("Access denied. This login page is only for vendors.");
        }
        setUser(null);
        setAuthTokens(null);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert(
        error.response?.data?.detail ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear state and localStorage
    setUser(null);
    setAuthTokens(null);
    setVendorData(null);
    setCustomerData(null);
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
    localStorage.removeItem("vendorData");
    localStorage.removeItem("customerData");

    // Redirect to login or homepage
    window.location.href = "/";
  };

  // const logout = async () => {
  //   setLoading(true);
  //   try {
  //     // Send a logout request to the server
  //     const response = await buzzar_api.post("/logout/");

  //     console.log(response.data);
  //     // Clear user and token from state and localStorage
  //     setUser(null);
  //     setAuthTokens(null);
  //     setVendorData(null); // Clear vendor data on logout
  //     setCustomerData(null); // Clear customer data on logout
  //     localStorage.removeItem("tokens");
  //     localStorage.removeItem("user");
  //     localStorage.removeItem("categories");
  //     localStorage.removeItem("vendorData");
  //     localStorage.removeItem("customerData");

  //     // Redirect to the login or homepage
  //     // window.location.href = "/";
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //     alert("An error occurred while logging out. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <AuthContext.Provider
      value={{
        user,
        authTokens,
        loading,
        login,
        logout,
        categories,
        vendorData,
        customerData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using AuthContext
export const useAuth = () => useContext(AuthContext);
