import React from "react";
import { Button } from "@material-tailwind/react";
export const ChatIcon = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="hidden fixed bottom-4 right-4 bg-[#F6962E] text-white w-24 h-14 rounded-xl shadow-lg lg:flex items-center justify-center"
    >
      💬Chat
    </button>
  );
};
