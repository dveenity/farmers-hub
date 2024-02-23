import axios from "axios";
import { Link } from "react-router-dom";
import { FaCartPlus, FaChartLine, FaStore } from "react-icons/fa";
import { RxActivityLog } from "react-icons/rx";
import { BsArrowRight } from "react-icons/bs";
import { HiInboxArrowDown } from "react-icons/hi2";
import { useQuery } from "react-query";
import FetchLoader from "../../../Custom/FetchLoader";

const serVer = `https://farmers-hub-backend.vercel.app`;

const fetchAdminData = async (token, adminId) => {
  const urls = [
    `${serVer}/productsFetch`,
    `${serVer}/home`,
    `${serVer}/orders/${adminId}`,
    `${serVer}/delivered/${adminId}`,
  ];

  const [productsResponse, loggedInUserResponse, ordersResponse, soldResponse] =
    await Promise.all(
      urls.map((url) =>
        url.includes("productsFetch")
          ? axios.post(url)
          : axios.get(url, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
      )
    );

  const products = productsResponse.data;
  const loggedInUser = loggedInUserResponse.data;
  const orders = ordersResponse.data;
  const sold = soldResponse.data;

  const filteredProducts = products.filter(
    (product) => product.username === adminId
  );

  return {
    filteredProducts: filteredProducts.length,
    ordersLength: orders.length,
    salesLength: sold.length,
    adminId: loggedInUser.name,
  };
};

const AdminHome = () => {
  const { data, isLoading, isError } = useQuery("adminData", async () => {
    const token = localStorage.getItem("farm-users-new");
    const response = await axios.get(`${serVer}/home`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const loggedInUser = response.data;
    return fetchAdminData(token, loggedInUser.name);
  });

  if (isLoading) return <FetchLoader />;
  if (isError) return <div>Error fetching data</div>;

  const { filteredProducts, ordersLength, salesLength } = data;

  return (
    <div className="home-admin">
      <div className="dashboard">
        <div>
          <ul>
            <li>
              <Link to="/soldOrder">
                <div>
                  <strong>Total Sales</strong>
                  <FaChartLine className="dash-icons" />
                </div>
                <p>{salesLength}</p>
              </Link>
            </li>
            <li>
              <Link to="/adminOrders">
                <div>
                  <strong>New Orders</strong>
                  <HiInboxArrowDown className="dash-icons" />
                </div>
                <p>{ordersLength}</p>
              </Link>
            </li>
            <li>
              <Link to="/adminInventory">
                <div>
                  <strong>Inventory</strong>
                  <FaStore className="dash-icons" />
                </div>
                <p>{filteredProducts}</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="admin-section">
        <h3>What would you like to do today?</h3>
        <div className="admin-section-in">
          <ul className="admin-add">
            <li>
              <Link to="/addProduct">
                <FaCartPlus />
                Add
                <span>New Product</span>
              </Link>
            </li>
            <li>
              <Link to="/addActivity">
                <RxActivityLog /> Add
                <span>New Activity</span>
              </Link>
            </li>
          </ul>
          <div className="admin-view">
            <h4>Explore your activities</h4>
            <ul>
              <li>
                <Link to="/adminInventory">
                  View your Products
                  <BsArrowRight />
                </Link>
              </li>
              <li>
                <Link to="/adminInventory">
                  View your Activities
                  <BsArrowRight />
                </Link>
              </li>
              <li>
                <Link to="/adminOrders">
                  View New Orders
                  <BsArrowRight />
                </Link>
              </li>
              <li>
                <Link to="/soldOrder">
                  View Sold
                  <BsArrowRight />
                </Link>
              </li>
              <li>
                <Link to="/calendar">
                  View Product Calendar
                  <BsArrowRight />
                </Link>
              </li>
              <li>
                <Link to="/purchases">
                  Purchases
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

export default AdminHome;
