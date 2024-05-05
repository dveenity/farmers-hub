import { Link } from "react-router-dom";
import { FaChartLine, FaStore } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";
import { HiInboxArrowDown } from "react-icons/hi2";
import { useQuery } from "react-query";
import FetchLoader from "../../../Custom/FetchLoader";
import {
  fetchAdminDeliveredOrders,
  fetchAdminOrders,
  fetchProducts,
  fetchUser,
} from "../../../Hooks/useFetch";

const AdminHome = () => {
  // fetch admin details
  const { data, isLoading, isError } = useQuery("adminData", fetchUser);

  // fetch products
  const {
    data: productsData,
    isLoading: productsIsLoading,
    isError: productsIsError,
  } = useQuery("products", fetchProducts);

  // fetch admin Orders
  const {
    data: ordersData,
    isLoading: ordersIsLoading,
    isError: ordersIsError,
  } = useQuery("adminOrders", () => fetchAdminOrders(username));

  // fetch admin delivered orders
  const {
    data: deliveredOrdersData,
    isLoading: deliveredOrdersIsLoading,
    isError: deliveredOrdersIsError,
  } = useQuery("deliveredOrders", () => fetchAdminDeliveredOrders(username));

  if (
    isLoading ||
    productsIsLoading ||
    ordersIsLoading ||
    deliveredOrdersIsLoading
  ) {
    return <FetchLoader />;
  }
  if (isError || productsIsError || ordersIsError || deliveredOrdersIsError) {
    return <div>Error fetching data</div>;
  }

  const { username } = data;

  const filteredProducts = productsData.filter(
    (product) => product.username === username
  );

  const filteredProductsLength = filteredProducts?.length;

  const ordersLength = ordersData?.length;

  const salesLength = deliveredOrdersData?.length;

  // create activities object array and map into dom
  const activitiesAll = [
    { name: "Learning Hub", link: "/tutorial" },
    { name: "View your Products", link: "/adminInventory" },
    { name: "View your Activities", link: "/adminInventory" },
    { name: "View New Orders", link: "/adminOrders" },
    { name: "View Sold", link: "/soldOrder" },
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
                <p>{filteredProductsLength}</p>
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
