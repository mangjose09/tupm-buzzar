import React from "react";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const AuthNavBar = () => {
  const location = useLocation();
  const headerTitle = location.state?.headerTitle || " Vendor Login";

  return (
    <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between text-blue-gray-900">
        <div className="flex flex-row justify-center items-center">
          <Link to="/">
            <img
              className="h-10 w-20 md:w-auto object-contain p-0"
              src="/BUZZAR_BRAND_NAME_NO_BG.png"
              alt="buzzar branding"
            />
          </Link>
          <Typography
            variant="h5"
            className="text-black ml-2  py-1.5 text-base md:text-lg"
          >
            {headerTitle}
          </Typography>
        </div>
        <Link to="/faqs">
          <IconButton variant="text" className="inline-block md:hidden">
            <QuestionMarkCircleIcon className="h-6 w-6" />
          </IconButton>
          <Button variant="text" size="sm" className="hidden md:inline-block">
            <span>Need Help?</span>
          </Button>
        </Link>
      </div>
    </Navbar>
  );
};

export default AuthNavBar;
