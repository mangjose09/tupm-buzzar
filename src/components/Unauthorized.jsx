import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Button } from "@material-tailwind/react";
import { LockClosedIcon } from "@heroicons/react/24/outline"; // Importing the lock icon
import { useAuth } from "../context/authContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();


  const handleHomeClick = () => {
    if (user?.is_vendor) {
      navigate("/vendor/dashboard"); // Navigate to vendor dashboard if user is a vendor
    } else {
      navigate("/"); // Otherwise, navigate to the homepage
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#FDF6E9] px-4">
      <Card className="max-w-md w-full p-6 shadow-lg">
        <div className="flex flex-col items-center">
          <LockClosedIcon className="h-16 w-16 text-[#F8B34B] mb-4" />
          <Typography
            variant="h4"
            className="mb-2 font-bold text-gray-800 text-center"
          >
            Access Denied
          </Typography>
          <Typography
            variant="body1"
            className="mb-4 text-gray-600 text-center"
          >
            You do not have the necessary permissions to view this page.
          </Typography>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              aria-label="Go back to the previous page"
              className="w-full sm:w-auto"
            >
              Go Back
            </Button>
            <Button
              className="bg-[#F8B34B] w-full sm:w-auto"
              onClick={handleHomeClick} // Call the function to navigate based on the user type
              aria-label="Go to the homepage"
            >
              Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Unauthorized;
