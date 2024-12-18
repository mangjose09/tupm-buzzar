import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/authContext";
// Common Pages
import LandingPage from "./pages/LandingPage";
import ProductPage from "./pages/ProductPage";
import AboutUsPage from "./pages/AboutUsPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsAndConditionPage from "./pages/TermsAndConditionPage";
import NotFound from "./components/NotFound";
import ShopPage from "./pages/ShopPage";
// Customer Pages
import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerRegister from "./pages/customer/CustomerRegister";
import CustomerAsst from "./pages/customer/CustomerAsst";
import CustomerCheckout from "./pages/customer/CustomerCheckout";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerChats from "./pages/customer/CustomerChats";
import CustomerOrders from "./pages/customer/CustomerOrders";
import CustomerCart from "./pages/customer/CustomerCarts";

// Vendor Pages
import VendorLogin from "./pages/vendor/VendorLogin";
import VendorRegister from "./pages/vendor/VendorRegister";
import VendorAsst from "./pages/vendor/VendorAsst";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorOrders from "./pages/vendor/VendorOrders";
import VendorProducts from "./pages/vendor/VendorProducts";
import VendorStoreProfile from "./pages/vendor/VendorStoreProfile";
import VendorSettings from "./pages/vendor/VendorSettings";
import VendorProductsAdd from "./pages/vendor/products/VendorProductsAdd";
import VendorProductsEdit from "./pages/vendor/products/VendorProductsEdit";
import ForgotPassword from "./pages/ForgotPassword";
import AdminLogin from "./pages/super-admin/AdminLogin";
import AdminDashboard from "./pages/super-admin/AdminDashboard";
import AdminVendorProfile from "./pages/super-admin/AdminVendorProfile";
import VendorChats from "./pages/vendor/VendorChats";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* General Public Routes */}

          <Route path="/" element={<LandingPage />} />

          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/faqs" element={<FAQPage />} />
          <Route path="/vendor-assistance" element={<VendorAsst />} />
          <Route path="/customer-assistance" element={<CustomerAsst />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditionPage />}
          />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Customer Public Routes */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/register" element={<CustomerRegister />} />

          {/* Vendor Public Routes */}
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/vendor/register" element={<VendorRegister />} />

          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Customer Protected Routes */}
          <Route element={<PrivateRoute allowedRoles={["customer"]} />}>
            <Route path="/customer/checkout" element={<CustomerCheckout />} />
            <Route path="/customer/settings" element={<CustomerProfile />} />
            <Route path="/customer/chats" element={<CustomerChats />} />
            <Route path="/customer/orders" element={<CustomerOrders />} />
          </Route>

          {/* Vendor Protected Routes */}
          <Route element={<PrivateRoute allowedRoles={["vendor"]} />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/orders" element={<VendorOrders />} />
            <Route path="/vendor/products" element={<VendorProducts />} />
            <Route path="/vendor/chats" element={<VendorChats />} />
            <Route
              path="/vendor/products/add"
              element={<VendorProductsAdd />}
            />
            <Route
              path="/vendor/products/edit/:productId"
              element={<VendorProductsEdit />}
            />
            <Route
              path="/vendor/store-profile"
              element={<VendorStoreProfile />}
            />
            <Route path="/vendor/settings" element={<VendorSettings />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/vendor-profile/:userId"
              element={<AdminVendorProfile />}
            />
          </Route>
          {/* Catch-All Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
