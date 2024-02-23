import { useQuery } from "react-query";
import Clock from "../../Custom/Clock";
import AdminHome from "./Admin/AdminHome";
import Navigation from "../../Custom/Navigation";
import FetchLoader from "../../Custom/FetchLoader";
import UserHome from "./User/UserHome";

const serVer = `https://farmers-hub-backend.vercel.app`;

const fetchUserRole = async () => {
  const token = localStorage.getItem("farm-users-new");

  const response = await fetch(`${serVer}/home`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

const Home = () => {
  const { data, isLoading, isError } = useQuery("userRole", fetchUserRole);

  if (isLoading) return <FetchLoader />;
  if (isError) return <div>Error fetching user</div>;

  const { role, name } = data;

  return (
    <div className="home">
      <h1>Agro Farmer&apos;s Hub</h1>
      <div>
        <div className="home-greet">
          <Clock />
          <h2>Hi, {name.split(" ")[1]}</h2>
        </div>
        {role === "user" && <UserHome />}
        {role === "admin" && <AdminHome />}
      </div>
      <Navigation />
    </div>
  );
};

export default Home;
