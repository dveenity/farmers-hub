import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../../Custom/Navigation";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("farm-users");
        const response = await axios.get("http://localhost:7001/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { username } = response.data;
        setUserId(username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!userId) return;

        const url = `http://localhost:7001/ordersUser/${userId}`;

        const response = await axios.get(url);
        const { data } = response;

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userId, result]); // Add 'result' to the dependency array

  const handleCancelOrder = async (orderId) => {
    try {
      const url = `http://localhost:7001/order/${orderId}`;
      const response = await axios.delete(url);

      if (response.status === 200) {
        setResult("order cancelled & deleted successfully");

        setTimeout(() => {
          setResult(null);
        }, 3000);
      } else {
        console.error("Error deleting product:", response.data);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div>
      <h1>My Orders</h1>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            <p>{order.productName}</p>
            <p>{order.price}</p>
            <p>status: {order.status}</p>
            <button onClick={() => handleCancelOrder(order._id)}>
              Cancel Order
            </button>
          </li>
        ))}
      </ul>
      <p>{result}</p>
      <Navigation />
    </div>
  );
};

export default Orders;
