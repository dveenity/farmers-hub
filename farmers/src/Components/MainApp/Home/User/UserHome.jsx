import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdSpeedometer } from "react-icons/io";
import { BsArrowRight } from "react-icons/bs";
import axios from "axios";
import { useQuery } from "react-query";
import FetchLoader from "../../../Custom/FetchLoader";

const serVer = `https://farmers-hub-backend.vercel.app`;

const UserHome = () => {
  const [userId, setUserId] = useState(null);

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery("products", async () => {
    try {
      const response = await axios.post(`${serVer}/productsFetch`);
      return response.data;
    } catch (error) {
      throw new Error("Error fetching products");
    }
  });

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery("orders", async () => {
    const token = localStorage.getItem("farm-users");
    const response = await axios.get(`${serVer}/ordersUser/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  });

  const {
    data: salesData,
    isLoading: salesLoading,
    isError: salesError,
  } = useQuery("sales", async () => {
    const token = localStorage.getItem("farm-users");
    const response = await axios.get(`${serVer}/purchased/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("farm-users");
      const url = `${serVer}/home`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const loggedInUser = response.data;
      setUserId(loggedInUser.username);
    };

    fetchUser();
  }, []);

  if (productsLoading || ordersLoading || salesLoading) return <FetchLoader />;
  if (productsError || ordersError || salesError)
    return <div>Error fetching data</div>;

  const inventoryProducts = productsData ? productsData.length : 0;
  const ordersLength = ordersData ? ordersData.length : 0;
  const salesLength = salesData ? salesData.length : 0;

  return (
    <div className="home-admin">
      <div className="dashboard">
        <div>
          <ul>
            <li>
              <Link to="/purchases">
                Total purchases<p>{salesLength}</p>
              </Link>
            </li>
            <li>
              <Link to="/orders">
                Pending Orders<p>{ordersLength}</p>
              </Link>
            </li>
            <li>
              <Link to="/inventory">
                Total Inventory<p>{inventoryProducts}</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="admin-section">
        <h3>What makes us special</h3>
        <div className="admin-section-in">
          <ul className="admin-add">
            <li>
              <p>
                <IoMdSpeedometer />
                <span>Fast Delivery</span>
              </p>
            </li>
            <li>
              <p>
                <IoMdSpeedometer />
                <span>Reliable</span>
              </p>
            </li>
            <li>
              <p>
                <IoMdSpeedometer />
                <span>Order Status</span>
              </p>
            </li>
            <li>
              <p>
                <IoMdSpeedometer />
                <span>Chat with sellers</span>
              </p>
            </li>
          </ul>
          <div className="admin-view">
            <h4>Explore your activities</h4>
            <ul>
              <li>
                <Link to="/calendar">
                  Product Availability Calendar
                  <BsArrowRight />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
