import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/authContext";
import buzzar_api from "../../config/api-config";
import { Typography, Button } from "@material-tailwind/react";

export const ChatPopup = ({ chats, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [connectionError, setConnectionError] = useState(null);
  const { user, authTokens } = useAuth();

  const ws = useRef(null); // WebSocket reference
  const messagesEndRef = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const differenceInMs = now - date;

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await buzzar_api.get("/chat/");
        const rooms = response.data;

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
      }
    };

    fetchChatRooms();
  }, []);

  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!selectedChatId) return;
      setLoading(true);
      setError(null);
      try {
        const response = await buzzar_api.get(`/chat/${selectedChatId}/`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
        setError("Error fetching chat messages");
      } finally {
        setLoading(false);
      }
    };

    fetchChatMessages();
  }, [selectedChatId]);

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!selectedChatId || !authTokens.access) return;

    const receiverId = chatRooms.find(
      (room) => room.id === selectedChatId
    )?.receiver_id;
    if (!receiverId) return;

    const socketUrl = `ws://3.0.224.11/${user.id}/chat/${receiverId}/?token=${authTokens.access}`;
    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      console.log(
        "WebSocket connection established successfully with:",
        socketUrl
      );
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newMessage = {
        content: data.message,
        sender: data.user,
        sender_name: data.user_full_name,
        sent_at: data.created_at,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

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
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [selectedChatId, authTokens.access, user.id, chatRooms]);

  const handleSendMessage = (message) => {
    if (message.trim()) {
      ws.current.send(JSON.stringify({ message: message }));
      setMessageInput(""); // Clear the input field after sending
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-100 h-[400px] bg-white shadow-xl rounded-lg flex flex-col overflow-hidden">
      <div className="flex justify-between items-center bg-black p-3 text-white">
        <span className="font-bold">Chats</span>
        <button onClick={onClose} className="text-lg hover:text-gray-300">
          ✖
        </button>
      </div>

      <div className="flex h-full">
        <aside className="w-1/3 border-r overflow-y-auto h-[calc(30vh-100px)]">
          {chats.length > 0 ? (
            chatRooms.map((room) => (
              <div
                key={room.id}
                className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
                  room.id === selectedChatId ? "bg-gray-100" : ""
                }`}
                onClick={() => setSelectedChatId(room.id)}
              >
                <p className="font-semibold">{room.receiver_name}</p>
                <p className="text-sm text-gray-600 truncate">
                  {room.last_message}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-5">No chats yet</p>
          )}
        </aside>

        <div className="w-2/3 flex flex-col max-h-80">
          {connectionError && (
            <div className="p-2 bg-red-100 text-red-600 text-sm text-center">
              {connectionError}
            </div>
          )}

          {selectedChatId ? (
            <>
              <div className="p-3 border-b">
                <h2 className="font-bold">
                  {selectedChatId
                    ? chatRooms.find((room) => room.id === selectedChatId)
                        ?.receiver_name
                    : "Vendor"}
                </h2>
              </div>
              <div className="flex-grow p-3 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === user.id ? "justify-end" : "justify-start"
                    } mb-4`}
                  >
                    <div className="flex flex-col">
                      <Typography
                        variant="small"
                        className={`font-bold ${
                          msg.sender === user.id ? "text-right" : "text-left"
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
              </div>
              <div className="p-3 border-t flex items-center">
                <input
                  type="text"
                  placeholder="Type a message"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage(messageInput);
                  }}
                  className="flex-grow border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  onClick={() => handleSendMessage(messageInput)}
                  className="ml-2 bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <Typography variant="h6" className="text-gray-500">
                Select a chat to start messaging
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
