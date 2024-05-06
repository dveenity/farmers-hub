import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import axios from "axios";
import { useQuery } from "react-query";
import FetchLoader from "../../../Custom/FetchLoader";
import Slider from "./Slider";
import { FaChartLine, FaStore } from "react-icons/fa";
import { HiInboxArrowDown } from "react-icons/hi2";
import {
  fetchProducts,
  fetchUserOrders,
  fetchUserPurchases,
} from "../../../Hooks/useFetch";

const serVer = `https://farmers-hub-backend.vercel.app`;

const UserHome = ({ user }) => {
  const { name } = user;

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery("products", fetchProducts);

  const {
    data: ordersData,
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery("orders", async () => await fetchUserOrders(name));

  const {
    data: salesData,
    isLoading: salesLoading,
    isError: salesError,
  } = useQuery("sales", async () => await fetchUserPurchases(name));

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
                <div>
                  <strong>Total purchases</strong>
                  <FaChartLine className="dash-icons" />
                </div>
                <p>{salesLength}</p>
              </Link>
            </li>
            <li>
              <Link to="/orders">
                <div>
                  <strong>Pending Orders</strong>
                  <HiInboxArrowDown className="dash-icons" />
                </div>
                <p>{ordersLength}</p>
              </Link>
            </li>
            <li>
              <Link to="/inventory">
                <div>
                  <strong>Total Inventory</strong>
                  <FaStore className="dash-icons" />
                </div>
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
                <Link to="/tutorial">
                  Learning Hub
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
