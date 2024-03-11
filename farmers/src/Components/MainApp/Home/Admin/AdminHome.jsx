import axios from "axios";
import { Link } from "react-router-dom";
import { FaChartLine, FaStore } from "react-icons/fa";
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

  // create activities object array and map into dom
  const activitiesAll = [
    { name: "View your Products", link: "/adminInventory" },
    { name: "View your Activities", link: "/adminInventory" },
    { name: "View New Orders", link: "/adminOrders" },
    { name: "View Sold", link: "/soldOrder" },
    { name: "View Product Calendar", link: "/calender" },
    { name: "Purchases", link: "/purchases" },
    { name: "Estimator", link: "/calculator" },
  ];

  const activitiesOut = activitiesAll.map((activity, i) => (
    <li key={i}>
      <Link to={activity.link}>
        {activity.name}
        <BsArrowRight />
      </Link>
    </li>
  ));

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
                Add
                <span>New Product</span>
              </Link>
            </li>
            <li>
              <Link to="/addActivity">
                Add
                <span>New Activity</span>
              </Link>
            </li>
          </ul>
          <div className="admin-view">
            <h4>Explore your activities</h4>
            <ul>{activitiesOut}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
