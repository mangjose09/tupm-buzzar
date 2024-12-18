import axios from "axios";

// List of unprotected endpoints
const unprotectedEndpoints = ["/login", "/register", "/verify-otp"]; // Add your unprotected endpoints here

// Create the Axios instance with base URL and credentials
const buzzar_api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/`,
  withCredentials: true,
});

// Function to refresh the JWT token using an async arrow function
const refreshToken = async () => {
  const storedToken = localStorage.getItem("tokens");
  const token = storedToken ? JSON.parse(storedToken) : null;

  // Check for the refresh token
  if (!token || !token.refresh) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await buzzar_api.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/jwt/refresh/`,
      { refresh: token.refresh }
    );

    const newToken = response.data; // Update based on your API response structure
    localStorage.setItem("tokens", JSON.stringify(newToken));

    return newToken.access; // Return the new access token
  } catch (error) {
    console.error("Failed to refresh token:", error);
    // Automatically log out on refresh token failure
    logout();
    throw error; // Rethrow the error for handling in the interceptor
  }
};

// Request interceptor to add the Bearer token except for unprotected endpoints
buzzar_api.interceptors.request.use(
  (config) => {
    const storedToken = localStorage.getItem("tokens");
    const token = storedToken ? JSON.parse(storedToken) : null;

    // Check if the request URL is part of the unprotected endpoints
    const isUnprotected = unprotectedEndpoints.some((endpoint) =>
      config.url.includes(endpoint)
    );

    // If the request is not to an unprotected route, add the Authorization header
    if (!isUnprotected && token && token.access) {
      config.headers.Authorization = `Bearer ${token.access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration and retry requests
buzzar_api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the request URL is part of the unprotected endpoints
    const isUnprotected = unprotectedEndpoints.some((endpoint) =>
      originalRequest.url.includes(endpoint)
    );

    // Only handle token refresh if the request is not to an unprotected route
    if (
      !isUnprotected &&
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry // Prevent infinite refresh attempts
    ) {
      originalRequest._retry = true; // Mark the request as a retry attempt

      // Add a flag to identify the refresh token request
      if (originalRequest.url.includes("/auth/jwt/refresh/")) {
        return Promise.reject(error); // Don't retry refresh token requests
      }

      try {
        const newAccessToken = await refreshToken(); // Await the refresh token call

        // Set the new token in the header and retry the original request
        buzzar_api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return await buzzar_api(originalRequest); // Await the retry of the original request
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Directly log out on refresh token failure
        logout();
        return Promise.reject(refreshError); // Reject the promise with the refresh error
      }
    }

    // If it's an unprotected route or not a 401 error, return the original error
    return Promise.reject(error);
  }
);

// Function to handle user logout
const logout = () => {
  localStorage.removeItem("tokens");
  localStorage.removeItem("user");
  localStorage.removeItem("categories");
  localStorage.removeItem("vendorData");
  localStorage.removeItem("customerData");

  window.location.href = "/"; // Redirect to login or homepage
};

export default buzzar_api;
