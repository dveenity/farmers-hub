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
} from "../../../Hooks/useFetch";
import PropTypes from "prop-types";

const AdminHome = ({ user }) => {
  const { name } = user;

  // Fetch products
  const {
    data: productsData,
    isLoading: productsIsLoading,
    isError: productsIsError,
  } = useQuery("products", fetchProducts);

  // Fetch admin Orders
  const {
    data: ordersData,
    isLoading: ordersIsLoading,
    isError: ordersIsError,
  } = useQuery("adminOrders", () => fetchAdminOrders(name));

  // Fetch admin delivered orders
  const {
    data: deliveredOrdersData,
    isLoading: deliveredOrdersIsLoading,
    isError: deliveredOrdersIsError,
  } = useQuery("deliveredOrders", () => fetchAdminDeliveredOrders(name));

  if (productsIsLoading || ordersIsLoading || deliveredOrdersIsLoading) {
    return <FetchLoader />;
  }

  if (productsIsError || ordersIsError || deliveredOrdersIsError) {
    return <div>Error fetching data</div>;
  }

  const filteredProducts = productsData.filter(
    (product) => product.username === name
  );

  const filteredProductsLength = filteredProducts?.length;

  const ordersLength = ordersData?.length;

  const salesLength = deliveredOrdersData?.length;

  // create activities object array and map into dom
  const activitiesAll = [
    { name: "Learning Hub", link: "/tutorial" },
    { name: "Estimator", link: "/calculator" },
  ];

  const activitiesOut = activitiesAll.map((activity, i) => (
    <li key={i}>
      <Link to={activity.link} state={{ name }}>
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
              <Link to="/soldOrder" state={{ deliveredOrdersData }}>
                <div>
                  <strong>Total Sales</strong>
                  <FaChartLine className="dash-icons" />
                </div>
                <p>{salesLength}</p>
              </Link>
            </li>
            <li>
              <Link to="/adminOrders" state={{ name }}>
                <div>
                  <strong>New Orders</strong>
                  <HiInboxArrowDown className="dash-icons" />
                </div>
                <p>{ordersLength}</p>
              </Link>
            </li>
            <li>
              <Link to="/adminInventory" state={{ user }}>
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

AdminHome.propTypes = {
  user: PropTypes.object.isRequired,
};

export default AdminHome;
