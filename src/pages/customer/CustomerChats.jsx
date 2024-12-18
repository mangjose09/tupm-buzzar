import React, { useEffect, useState, useRef } from "react";
import { Typography, Button } from "@material-tailwind/react";
import { useAuth } from "../../context/authContext";
import buzzar_api from "../../config/api-config"; // Ensure the API configuration is imported
import { UserCircleIcon } from "@heroicons/react/24/outline";
import CustomerSideBar from "../../components/CustomerSideBar";
import Header from "../../components/Header";

const CustomerChats = () => {
  const { user, authTokens } = useAuth(); // Get the logged-in user's ID and auth token
  const [chatRooms, setChatRooms] = useState([]); // State for chat rooms
  const [messages, setMessages] = useState([]); // State for chat messages
  const [visibleCount, setVisibleCount] = useState(6); // Initially show 6 messages

  const [selectedChatId, setSelectedChatId] = useState(null); // State for the selected chat room
  const [loading, setLoading] = useState(false); // Loading state for fetching messages
  const [error, setError] = useState(null); // Error state for messages fetch
  const [messageInput, setMessageInput] = useState(""); // State for message input

  const fullName = `${user.firstName} ${user.lastName}`;

  const ws = useRef(null); // WebSocket reference
  const messagesEndRef = useRef(null); // Reference for scrolling to the latest message

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const differenceInMs = now - date;

    // Calculate time differences
    const differenceInSeconds = Math.floor(differenceInMs / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);

    if (differenceInSeconds < 60) {
      return "Just Now"; // Less than a minute
    } else if (differenceInMinutes < 60) {
      return `${differenceInMinutes} min${
        differenceInMinutes > 1 ? "s" : ""
      } ago`;
    } else if (differenceInHours < 24) {
      return `${differenceInHours} hour${differenceInHours > 1 ? "s" : ""} ago`;
    } else {
      // Format the date (MM/DD/YYYY h:mm AM/PM)
      const formattedDate = date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const formattedTime = date.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      return `${formattedDate} ${formattedTime}`;
    }
  };

  // Scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chat rooms on component mount
  useEffect(() => {
    const fetchChatRooms = async () => {
      setLoading(true);
      try {
        const response = await buzzar_api.get("/chat/");
        const rooms = response.data;

        // Fetch last message for each chat room
        const updatedRooms = await Promise.all(
          rooms.map(async (room) => {
            try {
              const messagesResponse = await buzzar_api.get(
                `/chat/${room.id}/`
              );
              const messages = messagesResponse.data;
              const lastMessage =
                messages.length > 0
                  ? messages[messages.length - 1].content
                  : "No messages yet";
              return { ...room, last_message: lastMessage };
            } catch (error) {
              console.error(
                `Error fetching messages for room ${room.id}:`,
                error
              );
              return { ...room, last_message: "Error loading messages" };
            }
          })
        );

        setChatRooms(updatedRooms);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
        setError("Error fetching chat rooms");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchChatRooms();
  }, []);

  // Fetch chat messages for the selected chat room
  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!selectedChatId) return; // Do not fetch if no chat is selected
      setLoading(true); // Start loading
      setError(null); // Reset error state before fetching
      try {
        const response = await buzzar_api.get(`/chat/${selectedChatId}/`);
        setMessages(response.data); // Save chat messages to state
      } catch (error) {
        console.error("Error fetching chat messages:", error);
        setError("Error fetching chat messages");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchChatMessages();
  }, [selectedChatId]);

  // Scroll to the latest message whenever messages change
  useEffect(scrollToBottom, [messages]);

  const handleShowMoreMessages = () => {
    setVisibleCount(visibleCount + 6); // Increase the count by 6 each time
  };

  // Set up the WebSocket connection when a chat is selected
  useEffect(() => {
    if (!selectedChatId || !authTokens.access) return;

    const senderId = chatRooms.find(
      (room) => room.id === selectedChatId
    )?.sender_id;
    if (!senderId) return;

    const socketUrl = `ws://3.0.224.11/${senderId}/chat/${user.id}/?token=${authTokens.access}`;
    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      console.log(
        "WebSocket connection established successfully with:",
        socketUrl
      );
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message data:", data);
      const newMessage = {
        content: data.message,
        sender: data.user,
        sender_name: data.user_full_name,
        sent_at: data.created_at,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Update the last message in the chatRooms state
      setChatRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === selectedChatId
            ? { ...room, last_message: newMessage.content }
            : room
        )
      );
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setError("WebSocket error. Please try again.");
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
        console.log("WebSocket connection closed during cleanup.");
      }
    };
  }, [selectedChatId, authTokens.access, user.id, chatRooms]);

  const handleSendMessage = (message) => {
    if (message.trim()) {
      ws.current.send(JSON.stringify({ message: message }));
      setMessageInput(""); // Clear the input field after sending
    }
  };

  // Skeleton Loader for chat rooms
  const ChatRoomSkeleton = () => (
    <li className="p-4 border-b cursor-pointer animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="flex flex-col">
          <div className="w-24 h-4 bg-gray-300 rounded"></div>
          <div className="w-32 h-4 bg-gray-300 rounded mt-2"></div>
        </div>
      </div>
    </li>
  );

  const [isChatListVisible, setIsChatListVisible] = useState(false); // State to toggle chat list visibility on mobile

  return (
    <>
      <Header />
      <main className="flex flex-col lg:flex-row min-h-screen">
        <CustomerSideBar />
        <section className="flex flex-col w-full p-6 md:p-10">
          <header>
            <Typography variant="h1">Chats</Typography>
            <Typography variant="paragraph" className="text-gray-600">
              Check and respond to your customers' messages.
            </Typography>
          </header>

          <div className="mt-6 flex flex-col lg:flex-row bg-white rounded-lg shadow-md overflow-hidden h-full">
            {/* Chat List Section */}
            <div className="w-full lg:w-1/3 border-r bg-gray-100">
              <div className="flex justify-between items-center p-4 border-b bg-gray-300">
                <Typography variant="h6">Customers</Typography>
                {/* Button to toggle chat list visibility on mobile */}
                <Button
                  onClick={() => setIsChatListVisible(!isChatListVisible)}
                  className="lg:hidden "
                  variant="outlined"
                  size="sm"
                >
                  {isChatListVisible ? "Hide Chats" : "Show Chats"}
                </Button>
              </div>

              {/* Chat list */}
              <ul
                className={`overflow-y-auto h-[calc(100vh-200px)] ${
                  isChatListVisible ? "block" : "hidden"
                } lg:block`}
              >
                {loading
                  ? [...Array(5)].map((_, idx) => (
                      <ChatRoomSkeleton key={idx} />
                    ))
                  : chatRooms.map((room) => (
                      <li
                        key={room.id}
                        className={`p-4 border-b cursor-pointer transition duration-300 ease-in-out ${
                          room.id === selectedChatId
                            ? "bg-[#F6962E] text-white"
                            : "hover:bg-[#F4A460] hover:text-white"
                        }`}
                        onClick={() => setSelectedChatId(room.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#F6962E] rounded-full flex-shrink-0">
                            <UserCircleIcon className="text-white" />
                          </div>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              className="font-semibold"
                            >
                              {fullName === room.sender_name
                                ? room.sender_name
                                : room.receiver_name}
                            </Typography>
                            <Typography variant="small" className="font-thin">
                              {room.last_message || "Loading..."}
                            </Typography>
                          </div>
                        </div>
                      </li>
                    ))}
              </ul>
            </div>

            {/* Chat Messages Section */}
            <div className="w-full lg:w-2/3 flex flex-col">
              <div className="p-4 border-b bg-gray-300 flex justify-between items-center">
                <Typography variant="h6">
                  Chat with{" "}
                  {selectedChatId
                    ? (() => {
                        const room = chatRooms.find(
                          (room) => room.id === selectedChatId
                        );
                        return room
                          ? fullName === room.sender_name
                            ? room.sender_name
                            : room.receiver_name
                          : "Vendor";
                      })()
                    : "Vendor"}
                </Typography>
              </div>

              <div className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
                {messages.length > 0 ? (
                  <>
                    {/* Show More Button */}
                    {messages.length > visibleCount && (
                      <div className="text-center mt-4">
                        <Button
                          onClick={handleShowMoreMessages}
                          // className="text-[#F6962E]"
                          variant="text"
                          size="sm"
                        >
                          Show More
                        </Button>
                      </div>
                    )}
                    {messages.slice(-visibleCount).map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.sender === user.id
                            ? "justify-end"
                            : "justify-start"
                        } mb-4`}
                      >
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            className={`font-bold ${
                              msg.sender === user.id
                                ? "text-right"
                                : "text-left"
                            }`}
                          >
                            {msg.sender === user.id ? "You" : msg.sender_name}
                          </Typography>
                          <div
                            className={`p-3 max-w-xs rounded-lg ${
                              msg.sender === user.id
                                ? "bg-[#F6962E] text-white"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            <p>{msg.content}</p>
                          </div>
                          <Typography variant="small" className="text-gray-500">
                            {formatDate(msg.sent_at)}
                          </Typography>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <Typography variant="small" className="text-gray-500">
                    No messages yet
                  </Typography>
                )}
              </div>

              {/* Message Input Section */}
              <div className="flex items-center gap-2 p-4 border-t bg-gray-100">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full p-2 border rounded-md"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage(messageInput);
                    }
                  }}
                />
                <Button
                  className="bg-[#F6962E] px-4 py-3 md:px-6 md:py-3 "
                  onClick={() => handleSendMessage(messageInput)}
                  disabled={!messageInput.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default CustomerChats;
