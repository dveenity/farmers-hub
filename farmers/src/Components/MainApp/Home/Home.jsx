import { useQuery } from "react-query";
import Clock from "../../Custom/Clock";
import AdminHome from "./Admin/AdminHome";
import FetchLoader from "../../Custom/FetchLoader";
import UserHome from "./User/UserHome";
import Logout from "../../Custom/Logout";

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
  if (isError)
    return (
      <div>
        Error fetching user
        <div>
          <Logout /> and try logging in again
        </div>
      </div>
    );

  const { role, name } = data;

  return (
    <div className="home">
      <div>
        <h1>Agro Farmer&apos;s Hub</h1>
        <Logout />
      </div>
      <div>
        <div className="home-greet">
          <Clock />
          <h2>Hi, {name.split(" ")[0]}</h2>
        </div>
        {role === "user" && <UserHome />}
        {role === "admin" && <AdminHome />}
      </div>
    </div>
  );
};

export default Home;
