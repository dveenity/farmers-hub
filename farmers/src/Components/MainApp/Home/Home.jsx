import { useState, useEffect } from "react";
import axios from "axios";
import Clock from "../../Custom/Clock";
import AdminHome from "./Admin/AdminHome";
import Navigation from "../../Custom/Navigation";
import { Link } from "react-router-dom";

const Home = () => {
  // State to store the user's role
  const [role, setRole] = useState("");
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
        setRole(data.role);
        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching user", error);
        setRole(error.data.role);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <div>
      <div>
        <Clock />
        <span>{username}</span>
        <h2>Welcome to the Farmer&apos;s Hub</h2>
      </div>
      {role === "user" && (
        <div>
          {/* Content for regular users */}
          <p>
            Welcome, regular user! You can view and manage your account here.
          </p>
        </div>
      )}
      {/* Content for Admin/Farmers users */}
      {role === "admin" && <AdminHome />}
      {role !== "user" && role !== "admin" && (
        <div>
          {/* Error message for unknown roles */}
          <p>Unauthorized access or role not recognized.</p>
        </div>
      )}
      <Link to="/calendar">View Calender</Link>
      <Navigation />
    </div>
  );
};

export default Home;
