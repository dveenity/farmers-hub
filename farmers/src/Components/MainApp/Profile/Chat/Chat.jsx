import axios from "axios";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8800");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [username, setUsername] = useState("");

  useEffect(() => {
    const url = "http://localhost:7001/home";

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
    // Fetch previous messages only when component mounts on the chat route
    const fetchPreviousMessages = async () => {
      // Emit event to request previous messages from the server
      socket.emit("previousMessages");

      // Listen for previous messages
      socket.on("previousMessages", (previousMessages) => {
        setMessages(previousMessages);
      });
    };

    fetchPreviousMessages();

    // Clean up event listener
    return () => {
      socket.off("previousMessages");
    };
  }, []); // Only run once when component mounts

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

    return () => {
      // Clean up event listeners
      socket.off("previousMessages");
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    // Emit the "sendMessage" event to the server with the message data
    socket.emit("sendMessage", { content: inputValue, user: username });

    // Clear the input field after sending the message
    setInputValue("");
  };

  return (
    <div>
      <div className="messageBox">
        {/* Display previous messages */}
        {messages.map((message) => (
          <div
            key={message._id}
            style={{
              textAlign: message.sender === username ? "right" : "left",
              padding: "5px",
            }}>
            {/* Display username only for other users' messages */}
            {message.sender !== username && (
              <div style={{ fontWeight: "bold" }}>{message.sender}</div>
            )}
            {message.content}
          </div>
        ))}
      </div>
      <div>
        {/* Input field for new message */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
