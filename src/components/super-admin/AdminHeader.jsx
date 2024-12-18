import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Typography,
  Button,
  IconButton,
  Navbar,
  Collapse,
} from "@material-tailwind/react";
import { useAuth } from "../../context/authContext"; // Adjust the import according to your file structure

// Define the menu items in an array, including Logout
const MENUS = [
  { label: "Home", path: "/admin/dashboard" },
  { label: "About", path: "/admin/dashboard" },
  { label: "Services", path: "/admin/dashboard" },
  { label: "Contact", path: "/admin/dashboard" },
  { label: "Logout", action: "logout" }, // Add the logout item
];

const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu
  const location = useLocation();
  const { logout } = useAuth(); // Get the logout function from context

  const handleMenuClick = (path, action) => {
    if (action === "logout") {
      logout(); // Call the logout function when Logout is clicked
    } else {
      setMenuOpen(false); // Close mobile menu if a new tab is clicked
    }
  };

  return (
    <Navbar className="sticky z-10 top-0 min-w-full rounded-none bg-[#F6962E] border-none">
      <div className="flex items-center justify-between text-blue-gray-900">
        {/* Logo */}
        <header className="flex flex-row items-center gap-x-3">
          <img
            src="/BUZZAR_BRAND_NAME_NO_BG.png"
            className="h-8 w-auto object-contain"
          />
          <Typography variant="h5" color="white" className="hidden lg:block">
            Administrator
          </Typography>
        </header>

        {/* Desktop Menu - Hidden on smaller screens */}
        <div className="hidden sm:flex items-center space-x-4">
          {MENUS.map((menu, index) => (
            <div
              key={index}
              onClick={() => handleMenuClick(menu.path, menu.action)}
            >
              {menu.action === "logout" ? (
                <Button variant="gradient" size="sm">
                  <span>{menu.label}</span>
                </Button>
              ) : (
                <a
                  href={menu.path}
                  className={`text-white hover:text-black transition-colors duration-300`}
                >
                  {menu.label}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Menu Button - Visible on smaller screens */}
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit sm:hidden"
          ripple={false}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <XMarkIcon className="h-8 w-8 text-white" />
          ) : (
            <Bars3Icon className="h-8 w-8 text-white" />
          )}
        </IconButton>
      </div>

      {/* Mobile Menu - Use Collapse for show/hide */}
      <Collapse open={menuOpen}>
        <div className="sm:hidden flex-col space-y-2 mt-4">
          {MENUS.map((menu, index) => (
            <div
              key={index}
              onClick={() => handleMenuClick(menu.path, menu.action)}
            >
              {menu.action === "logout" ? (
                <Button variant="gradient" size="sm" fullWidth>
                  <span>{menu.label}</span>
                </Button>
              ) : (
                <a href={menu.path} className="block text-center">
                  {menu.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </Collapse>
    </Navbar>
  );
};

export default AdminHeader;
