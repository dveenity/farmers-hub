import axios from "axios";

const serVer = `https://agro-hub-backend.onrender.com`;
import { useState, useEffect, useRef } from "react";
import GoBack from "../../../Custom/GoBack";
import { IoIosSend } from "react-icons/io";
import io from "socket.io-client";

const socket = io("http://localhost:8800");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const [username, setUsername] = useState("");

  useEffect(() => {
    const url = `${serVer}/home`;

    // Retrieve the token from local storage
    const token = localStorage.getItem("farm-users");

    // Fetch the user's role from the server
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = response;

        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    // Fetch previous messages when component mounts
    socket.emit("previousMessages"); // Emit event to request previous messages from the server

    // Fetch previous messages when component mounts
    socket.on("previousMessages", (previousMessages) => {
      setMessages(previousMessages);
    });

    // Listen for new messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, []);

  const sendMessage = () => {
    // Emit the "sendMessage" event to the server with the message data
    socket.emit("sendMessage", { content: inputValue, user: username });

    // Clear the input field after sending the message
    setInputValue("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chatBox">
      <div>
        <GoBack />
        <div className="messageBox" style={{ position: "relative" }}>
          {/* Display previous messages */}
          {messages.map((message) => (
            <div
              className="messageBox-in"
              key={message._id}
              style={{
                position: "relative",
                backgroundColor:
                  message.sender === username ? "#00250e" : "green",
                marginLeft: message.sender === username ? "auto" : "0", // Stick to right if user is the sender
                marginRight: message.sender !== username ? "auto" : "0", // Stick to left if user is not the sender
              }}>
              {/* Display username only for other users' messages */}
              <div className="messageUser">
                {message.sender !== username && <div>{message.sender}:</div>}
                {/* Display message content */}
                <span>{message.content}</span>
              </div>
              {/* Display timestamp */}
              <p>{new Date(message.timestamp).toLocaleString()}</p>

              {/* Ref for scrolling to bottom */}
              <div ref={messagesEndRef} />
            </div>
          ))}
        </div>
        <div className="sendBox">
          {/* Input field for new message */}
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
