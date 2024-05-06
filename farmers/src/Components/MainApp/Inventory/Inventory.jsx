import { useEffect, useState } from "react";
import Products from "./Products";
import Activities from "./Activities";
import { FaCartShopping } from "react-icons/fa6";
import { RxActivityLog } from "react-icons/rx";
import { FcIdea } from "react-icons/fc";
import { useQuery } from "react-query";
import { fetchUser } from "../../Hooks/useFetch";
import FetchLoader from "../../Custom/FetchLoader";

const Inventory = () => {
  const [isProductsView, setIsProductsView] = useState(true);
  const [isActivityView, setIsActivityView] = useState(false);
  const [userAddress, setUserAddress] = useState({
    street: "",
    state: "",
    country: "",
    phone: "",
  });
  const [username, setUsername] = useState("");

  // fetch user
  const { data, isLoading, isError } = useQuery("user", fetchUser);

  useEffect(() => {
    if (isLoading) {
      return <FetchLoader />;
    }

    if (isError) {
      return <div>Error fetching data</div>;
    }

    const { name, address } = data;
    setUsername(name);
    setUserAddress(address);
  }, [isLoading, isError, data]);

  // Function to toggle between products and activities views
  const toggleProducts = () => {
    setIsProductsView(true);
    setIsActivityView(false);
  };

  const toggleActivity = () => {
    setIsActivityView(true);
    setIsProductsView(false);
  };

  return (
    <div className="inventory">
      <div className="tip">
        <FcIdea />
        <p>Tip: Click to toggle products & activities view</p>
      </div>
      <div className="inventory-switch">
        {/* Button to switch between products and activities views */}
        <button onClick={toggleProducts}>
          Products
          <FaCartShopping />
        </button>
        <button onClick={toggleActivity}>
          Activities
          <RxActivityLog />
        </button>
      </div>

      {/* Render Products or Activities based on the selected view */}
      {isProductsView && <Products user={[username, userAddress]} />}
      {isActivityView && <Activities user={username} />}
    </div>
  );
};

export default Inventory;
