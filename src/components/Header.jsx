import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import {
  Navbar,
  Typography,
  IconButton,
  Input,
  Badge,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCartIcon,
  Bars2Icon,
  HomeIcon,
  UserCircleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import buzzar_api from "../config/api-config";

const Header = () => {
  const { user, logout } = useAuth();
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const userName = user?.full_name;

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await buzzar_api.get(`/products/list`);
        setProductList(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = productList.filter((product) =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else if (showSuggestions) {
      const shuffled = [...productList].sort(() => 0.5 - Math.random());
      setFilteredProducts(shuffled.slice(0, 5));
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, showSuggestions, productList]);

  // Handle navigation to product page
  const handleProductClick = (id) => {
    navigate(`/product?id=${id}`);
    setShowSuggestions(false); // Hide dropdown after navigation
  };

  return (
    <>
      {/* Top Navigation */}
      <Navbar className="mx-auto max-w-full py-2 px-4 lg:px-8 lg:py-4 sticky top-0 z-10 rounded-none">
        <div className="flex justify-between items-center py-4 px-4">
          {/* Left Section - Logo */}
          <Link to="/">
            <img
              className="h-10 w-auto object-cover"
              src="/LONG-TEXT-NO-BG.png"
              alt="buzzar branding"
            />
          </Link>

          {/* Center Section - Search Bar */}
          <div className="relative lg:flex flex-1 items-center mx-8">
            <Input
              type="text"
              label="Search Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="pr-20"
              containerProps={{
                className: "w-full",
              }}
              // onBlur={() => setShowSuggestions(false)}
            />
            <Button size="sm" className="!absolute right-1 top-1 rounded">
              Search
            </Button>
            {/* Dropdown */}
            {filteredProducts.length > 0 && showSuggestions && (
              <div className="absolute top-full left-0 w-full bg-white shadow-md z-50 max-h-60 overflow-y-auto mt-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.product_images[0]?.image_upload}
                        alt={product.product_name}
                        className="h-10 w-10 object-cover rounded"
                      />
                      <span className="text-black">{product.product_name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 mx-8">
            <Typography as="a" href="/" className="text-black hover:underline">
              Home
            </Typography>
            <Typography
              as="a"
              href="/shop"
              className="text-black hover:underline"
            >
              Shop
            </Typography>
            <Typography
              as="a"
              href="/about-us"
              className="text-black hover:underline"
            >
              About Us
            </Typography>
          </div>

          {/* Right Section - Cart & Profile */}
          <div className="flex items-center space-x-6">
            {userName ? (
              <>
                <Badge content="3" overlap="circular" placement="top-end">
                  <IconButton variant="text">
                    <ShoppingCartIcon className="h-6 w-6 text-[#F8B34B]" />
                  </IconButton>
                </Badge>
                <Menu>
                  <MenuHandler>
                    <Typography className="hidden lg:flex text-black cursor-pointer">
                      Hi {userName}!
                    </Typography>
                  </MenuHandler>
                  <MenuList>
                    <MenuItem>
                      <Link to="/customer/settings" className="text-black">
                        View Profile
                      </Link>
                    </MenuItem>
                    <MenuItem onClick={logout} className="text-black">
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <Typography className="text-black space-x-2">
                <Link
                  to="/customer/login"
                  state={{ headerTitle: "Customer Login" }}
                  className="hover:underline"
                >
                  Login
                </Link>
                <span>/</span>
                <Link to="/customer/register" className="hover:underline">
                  Register
                </Link>
              </Typography>
            )}
          </div>
        </div>
      </Navbar>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md flex justify-around items-center py-2 lg:hidden z-10">
        <Link to="/" className="flex flex-col items-center text-gray-700">
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link to="/shop" className="flex flex-col items-center text-gray-700">
          <ShoppingBagIcon className="h-6 w-6" />
          <span className="text-xs">Shop</span>
        </Link>
        {userName && (
          <Link
            to="/customer/settings"
            className="flex flex-col items-center text-gray-700"
          >
            <UserCircleIcon className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </Link>
        )}
      </div>
    </>
  );
};

export default Header;
