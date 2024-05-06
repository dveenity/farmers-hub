import { useQuery } from "react-query";
import Clock from "../../Custom/Clock";
import AdminHome from "./Admin/AdminHome";
import FetchLoader from "../../Custom/FetchLoader";
import UserHome from "./User/UserHome";
import Logout from "../../Custom/Logout";
import { fetchUser } from "../../Hooks/useFetch";

const Home = () => {
  const { data, isLoading, isError } = useQuery("user", fetchUser);

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
        {role === "user" && <UserHome user={data} />}
        {role === "admin" && <AdminHome user={data} />}
      </div>
    </div>
  );
};

export default Home;
