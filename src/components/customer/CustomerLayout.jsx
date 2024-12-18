import React, { useState } from "react";
import { ChatIcon } from "./ChatIcon";
import { ChatPopup } from "./ChatPopup";
import { useAuth } from "../../context/authContext";

const CustomerLayout = ({ children }) => {
  const [isChatOpen, setChatOpen] = useState(false);
  const { user } = useAuth();
  // Example chat data
  const chats = [
    { name: "John Doe", message: "Hey, is the item still available?" },
    { name: "Jane Smith", message: "Thanks for the fast shipping!" },
  ];

  const toggleChat = () => setChatOpen(!isChatOpen);

  return (
    <div className="relative h-screen">
      {/* Main Content */}
      <main className="relative">{children}</main>

      {/* Floating Chat Button */}
      {user && <ChatIcon onClick={toggleChat} />}

      {/* Chat Popup */}
      {isChatOpen && <ChatPopup chats={chats} onClose={toggleChat} />}
    </div>
  );
};

export default CustomerLayout;
