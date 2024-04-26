import axios from "axios";

const serVer = `https://farmers-hub-backend.vercel.app`;
import { useState, useEffect, useRef } from "react";
import GoBack from "../../../Custom/GoBack";
import { IoIosSend } from "react-icons/io";
import io from "socket.io-client";
const chatServer = `https://farmers-hub-chat-backend.onrender.com`;

const Chat = () => {
  const socket = io(chatServer);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Fetch user data and set username
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("farm-users-new");
        const response = await axios.get(`${serVer}/home`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    // Subscribe to Socket.IO events
    socket.on("connect", () => console.log("Connected to socket.io server"));
    socket.on("disconnect", () =>
      console.log("Disconnected from socket.io server")
    );

    socket.on("previousMessages", (previousMessages) =>
      setMessages(previousMessages)
    );

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup function: unsubscribe from Socket.IO events
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("previousMessages");
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (!inputValue.trim()) return; // Don't send empty messages
    socket.emit("sendMessage", { content: inputValue, user: username });
    setInputValue(""); // Clear input field after sending message
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom when new messages arrive
  }, [messages]);

  return (
    <div className="chatBox">
      <div>
        <GoBack />
        <div className="messageBox" style={{ position: "relative" }}>
          {messages.map((message) => (
            <div
              className="messageBox-in"
              key={message._id}
              style={{
                position: "relative",
                backgroundColor:
                  message.sender === username ? "#00250e" : "green",
                marginLeft: message.sender === username ? "auto" : "0",
                marginRight: message.sender !== username ? "auto" : "0",
              }}>
              <div className="messageUser">
                {message.sender !== username && <div>{message.sender}:</div>}
                <span>{message.content}</span>
              </div>
              <p>{new Date(message.timestamp).toLocaleString()}</p>
              <div ref={messagesEndRef} />
            </div>
          ))}
        </div>
        <div className="sendBox">
          <input
            type="text"
            value={inputValue}
            placeholder="Send a new Message"
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={sendMessage}>
            <IoIosSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
