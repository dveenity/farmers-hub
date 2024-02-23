import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import axios from "axios";
import { useQuery } from "react-query";
import FetchLoader from "../../../Custom/FetchLoader";
import Slider from "./Slider";
import { FaChartLine, FaStore } from "react-icons/fa";
import { HiInboxArrowDown } from "react-icons/hi2";

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
    const token = localStorage.getItem("farm-users-new");
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
    const token = localStorage.getItem("farm-users-new");
    const response = await axios.get(`${serVer}/purchased/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("farm-users-new");
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
                <strong>Total purchases</strong>
                <FaChartLine className="dash-icons" />
                <p>{salesLength}</p>
              </Link>
            </li>
            <li>
              <Link to="/orders">
                <strong>Pending Orders</strong>
                <HiInboxArrowDown className="dash-icons" />
                <p>{ordersLength}</p>
              </Link>
            </li>
            <li>
              <Link to="/inventory">
                <strong>Total Inventory</strong>
                <FaStore className="dash-icons" />
                <p>{inventoryProducts}</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="admin-section">
        <h3>What makes us special</h3>
        <div className="admin-section-in">
          <div className="user-add">
            <Slider />
          </div>
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
