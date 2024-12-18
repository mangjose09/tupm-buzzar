import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ChevronRightIcon,
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ChatBubbleBottomCenterTextIcon,
  QuestionMarkCircleIcon,
  ArrowRightEndOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Typography } from "@material-tailwind/react";
import { useAuth } from "../context/authContext"; // Adjust the import according to your file structure

const MENUS = [
  {
    label: "Account Settings",
    path: "/customer/settings",
    icon: Cog6ToothIcon,
  },
  {
    label: "My Orders",
    path: "/customer/orders",
    icon: ClipboardDocumentIcon,
  },
  {
    label: "Chats",
    path: "/customer/chats",
    icon: ChatBubbleBottomCenterTextIcon,
  },
  // { label: "Help", path: "/vendor/help", icon: QuestionMarkCircleIcon },
];

const CustomerSideBar = () => {
  const [open, setOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu
  const location = useLocation();
  const { logout } = useAuth(); // Get the logout function from context

  const handleMenuClick = (path, action) => {
    if (action === "logout") {
      logout(); // Call the logout function when Logout is clicked
    } else if (location.pathname !== path) {
      setMenuOpen(false); // Close mobile menu if a new tab is clicked
    }
  };

  return (
    <>
      {/* Sidebar for larger screens */}
      <aside
        className={`${
          open ? "w-90" : "w-28"
        } hidden lg:block duration-300 h-screen bg-[#F4A460] sticky left-0 inset-y-0 p-5 pt-8`}
      >
        <ChevronRightIcon
          className={`w-8 h-8 p-1 absolute cursor-pointer -right-4 top-9 border-2 border-[#F4A460] bg-white rounded-full ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />
        <header className="flex items-center">
          <img
            src="/BUZZAR_BRAND_LOGO.png"
            className={`cursor-pointer duration-500 w-20 object-contain ${
              open && "rotate-[360deg]"
            }`}
            onClick={() => setOpen(!open)}
          />
          <Typography
            variant="h3"
            className={`text-white origin-left duration-150 ${
              !open && "scale-0"
            }`}
          >
            Customer Dashboard
          </Typography>
        </header>
        <ul className="mt-11 py-5">
          {MENUS.map((menu, index) => {
            const Icon = menu.icon;
            const isActive = location.pathname.startsWith(menu.path);

            return (
              <li
                key={index}
                className={`flex items-center hover:bg-white rounded-md cursor-pointer ${
                  isActive ? "bg-white" : "group"
                }`}
                onClick={() => handleMenuClick(menu.path, menu.action)} // Pass action to handleMenuClick
              >
                {!isActive ? (
                  <a
                    href={menu.path} // Use href for other menu items
                    className={`flex flex-row h-[50px] ${
                      !open ? "justify-center" : "items-center"
                    } gap-x-4 p-2 w-full`}
                  >
                    <div className="flex flex-row items-center gap-x-4">
                      <Icon
                        className={`w-6 h-6 ${
                          isActive
                            ? "text-[#F4A460]"
                            : "text-white group-hover:text-[#F4A460]"
                        }`}
                      />
                      <Typography
                        variant="lead"
                        className={`text-white group-hover:text-[#F4A460] ${
                          !open && "hidden"
                        } origin-left duration-200 ${
                          isActive ? "text-[#F4A460]" : ""
                        }`}
                      >
                        {menu.label}
                      </Typography>
                    </div>
                  </a>
                ) : (
                  // Render a div for the active menu to prevent click
                  <div
                    className={`flex flex-row h-[50px] ${
                      !open ? "justify-center" : "items-center"
                    } gap-x-4 p-2 w-full cursor-default`}
                  >
                    <div className="flex flex-row items-center gap-x-4">
                      <Icon
                        className={`w-6 h-6 ${
                          isActive
                            ? "text-[#F4A460]"
                            : "text-white group-hover:text-[#F4A460]"
                        }`}
                      />
                      <Typography
                        variant="lead"
                        className={`text-[#F4A460] ${
                          !open && "hidden"
                        } origin-left duration-200`}
                      >
                        {menu.label}
                      </Typography>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Navbar for smaller screens */}
      <nav className="block lg:hidden bg-[#F4A460] p-5">
        <div className="flex justify-between items-center">
          <img
            src="/BUZZAR_BRAND_NAME_NO_BG.png"
            className="w-32 sm:w-[25%]	 object-contain"
          />
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <XMarkIcon className="h-8 w-8 text-white" />
            ) : (
              <Bars3Icon className="h-8 w-8 text-white" />
            )}
          </button>
        </div>
        {/* Dropdown Menu */}
        {menuOpen && (
          <ul className="mt-5 space-y-3">
            {MENUS.map((menu, index) => {
              const Icon = menu.icon;
              const isActive = location.pathname.startsWith(menu.path);

              return (
                <li key={index} className="flex items-center">
                  {!isActive ? (
                    <a
                      href={menu.path} // Use href for other menu items
                      className={`flex items-center gap-x-3 p-2 w-full rounded-md ${
                        isActive ? "bg-white text-[#F4A460]" : "text-white"
                      }`}
                      onClick={() => handleMenuClick(menu.path, menu.action)} // Handle tab selection
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          isActive ? "text-[#F4A460]" : ""
                        }`}
                      />
                      <Typography variant="lead">{menu.label}</Typography>
                    </a>
                  ) : (
                    // Render a div for the active menu to prevent click
                    <div
                      className={`flex items-center gap-x-3 p-2 w-full rounded-md cursor-default ${
                        isActive ? "bg-white text-[#F4A460]" : "text-white"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          isActive ? "text-[#F4A460]" : ""
                        }`}
                      />
                      <Typography variant="lead">{menu.label}</Typography>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </>
  );
};

export default CustomerSideBar;
