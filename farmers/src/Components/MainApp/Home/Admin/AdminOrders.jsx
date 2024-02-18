import { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const [notificationTotal, setNotificationTotal] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [result, setResult] = useState("");

  const token = localStorage.getItem("farm-users");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:7001/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { username } = response.data;
        setAdminId(username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

  useEffect(() => {
    // Fetch products with notifications associated with each product
    const fetchOrdersNotifications = async () => {
      try {
        const token = localStorage.getItem("farm-users");
        const response = await axios.get(
          `http://localhost:7001/orders/${adminId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { data } = response;
        setNotificationTotal(data.length);
        setAdminOrders(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchOrdersNotifications();
  }, [adminId]);

  // update order status
  const toggleOrderStatus = async () => {
    try {
      if (!selectedOrder || !selectedStatus) {
        return;
      } // Return if no order or status selected

      // Send request to update order status
      await axios.put(`http://localhost:7001/orders/${selectedOrder._id}`, {
        status: selectedStatus,
      });

      // If status is "Delivered", move product to delivered schema
      if (selectedStatus === "Delivered") {
        await axios.put(
          `http://localhost:7001/deliver-product/${selectedOrder._id}`
        );

        setResult("Order moved to Sold");
      }

      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div>
      <h1>Order Notifications {notificationTotal}</h1>
      <ul>
        {adminOrders.map((product) => (
          <li key={product._id}>
            <ul>
              {product.notifications.map((notification, index) => (
                <li key={index}>
                  <p>{notification.message}</p>
                  <p>{notification.status}</p>
                  <button
                    onClick={() => {
                      const orderStatus = product.status;
                      setSelectedStatus(orderStatus);
                      setSelectedOrder(product);
                    }}>
                    View Order
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p>{result}</p>
      {selectedOrder && (
        <div className="modal-overlay">
          <dialog open className="modal">
            <div>
              <h2>Order Details</h2>
              <p>Buyer Name: {selectedOrder.username}</p>
              <p>Product Name: {selectedOrder.productName}</p>
              <p>Price: {selectedOrder.price}</p>
              <p>Status: {selectedOrder.status}</p>
              <label htmlFor="status">Select Status:</label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button onClick={toggleOrderStatus}>Update Status</button>
              <button onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
