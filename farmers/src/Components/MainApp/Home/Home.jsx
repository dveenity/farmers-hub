import { useState, useEffect } from "react";
import axios from "axios";
import Clock from "../../Custom/Clock";
import AdminHome from "./Admin/AdminHome";
import Navigation from "../../Custom/Navigation";
import UserHome from "./User/UserHome";

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
        setUsername(data.name.split(" ")[0]);
      } catch (error) {
        console.error("Error fetching user", error);
        setRole(error.data.role);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <div className="home">
      <div className="home-greet">
        <Clock />
        <h2>Hi, {username}</h2>
        <h3>Agro Farmer&apos;s Hub</h3>
      </div>
      {role === "user" && <UserHome />}
      {/* Content for Admin/Farmers users */}
      {role === "admin" && <AdminHome />}
      <Navigation />
    </div>
  );
};

export default Home;
