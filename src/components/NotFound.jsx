// components/NotFound.jsx
import React from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"; // Importing an icon

function NotFound() {
  const navigate = useNavigate(); // Initialize the navigate function

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#FDF6E9] px-4">
      <Card className="max-w-md w-full p-6 shadow-lg text-center">
        <div className="flex flex-col items-center">
          {/* <ExclamationCircleIcon className="h-20 w-20 text-[#F8B34B] mb-4 mx-auto" />{" "} */}
          {/* Icon for error indication */}
          <Typography className="text-8xl font-bold text-gray-800 mb-4">
            404
          </Typography>
          <Typography variant="h1" className="text-2xl text-gray-600 mb-4">
            Page Not Found
          </Typography>
          <Typography variant="paragraph" className="text-gray-500 mb-6">
            Sorry, the page you are looking for does not exist.
          </Typography>
          <div className="flex flex-col sm:flex-row sm:gap-x-4 gap-y-2 sm:gap-y-0">
            <Button
              color="gray"
              variant="outlined"
              onClick={() => navigate(-1)} // Go back to the previous page
              className="w-full sm:w-auto"
            >
              Go Back
            </Button>
            <Button
              className="bg-[#F8B34B] w-full sm:w-auto"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default NotFound;
