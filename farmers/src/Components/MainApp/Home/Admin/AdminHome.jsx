import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const serVer = `https://farmers-hub-backend.vercel.app`;
import { FaCartPlus } from "react-icons/fa";
import { RxActivityLog } from "react-icons/rx";
import { BsArrowRight } from "react-icons/bs";

const AdminHome = () => {
  const [salesLength, setSalesLength] = useState();
  const [inventoryProducts, setInventoryProducts] = useState();
  const [ordersLength, setOrdersLength] = useState();
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${serVer}/productsFetch`;
        const url2 = `${serVer}/home`;
        const url3 = `${serVer}/orders/${adminId}`;

        // Retrieve the token from local storage
        const token = localStorage.getItem("farm-users");

        // Fetch products from the server
        const response = await axios.post(url, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the fetched products into the state
        const allProducts = response.data;

        // Retrieve the logged-in user's username
        const responseId = await axios.get(url2, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const loggedInUser = responseId.data;
        setAdminId(loggedInUser.username);

        //Filter products based on the username
        const filteredProducts = allProducts.filter(
          (product) => product.username === adminId
        );
        setInventoryProducts(filteredProducts.length);

        // Fetch orders from the server
        const responseOrder = await axios.get(url3, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allOrders = responseOrder.data;
        setOrdersLength(allOrders.length);

        // fetch sold length from delivered schema
        const responseSold = await axios.get(`${serVer}/delivered/${adminId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = responseSold;
        setSalesLength(data.length);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [adminId]);

  return (
    <div className="home-admin">
      <div className="dashboard">
        <h2>Dashboard</h2>
        <div>
          <ul>
            <li>
              <Link to="/soldOrder">
                Total Sales<p>{salesLength}</p>
              </Link>
            </li>
            <li>
              <Link to="/adminOrders">
                New Orders<p>{ordersLength}</p>
              </Link>
            </li>
            <li>
              <Link to="/adminProducts">
                Inventory<p>{inventoryProducts}</p>
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
                <Link to="/adminProducts">
                  View your Products
                  <BsArrowRight />
                </Link>
              </li>
              <li>
                <Link to="/adminActivities">
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
                  View Product Calender
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
