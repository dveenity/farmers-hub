import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdSpeedometer } from "react-icons/io";
import { BsArrowRight } from "react-icons/bs";

const UserHome = () => {
  const [salesLength, setSalesLength] = useState();
  const [inventoryProducts, setInventoryProducts] = useState();
  const [ordersLength, setOrdersLength] = useState();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = "http://localhost:7001/productsFetch";
        const url2 = "http://localhost:7001/home";
        const url3 = `http://localhost:7001/ordersUser/${userId}`;
        const url4 = `http://localhost:7001/purchased/${userId}`;

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
        setUserId(loggedInUser.username);

        setInventoryProducts(allProducts.length);

        // Fetch orders from the server
        const responseOrder = await axios.get(url3, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allOrders = responseOrder.data;
        setOrdersLength(allOrders.length);

        // fetch sold length from delivered schema
        const responseSold = await axios.get(url4, {
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
  }, [userId]);

  return (
    <div className="home-admin">
      <div className="dashboard">
        <h2>Dashboard</h2>
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
