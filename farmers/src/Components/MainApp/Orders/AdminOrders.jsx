import { useEffect, useState } from "react";
import axios from "axios";
import GoBack from "../../Custom/GoBack";
import LoadingSpin from "../../Custom/LoadingSpin";

const AdminOrders = () => {
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const [notificationTotal, setNotificationTotal] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("Update Status");

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
  // call function
  fetchOrdersNotifications();

  // update order status
  const toggleOrderStatus = async () => {
    try {
      setStatus(<LoadingSpin />);
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

        await fetchOrdersNotifications();

        setSelectedOrder(null);
        setStatus("Update Status");
      } else {
        setResult("Status updated");

        setTimeout(() => {
          setResult(null);
        }, 3000);
        setStatus("Update Status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="adminOrders">
      <div className="adminOrders-box">
        <GoBack />
        <h1>
          Order Notifications <span>{notificationTotal}</span>
        </h1>
        <ul className="admin-notification">
          {adminOrders.map((product) => (
            <li key={product._id}>
              <ul>
                {product.notifications.map((notification, index) => (
                  <li key={index} className="admin-notification-li">
                    <p>{notification.message}</p>
                    <div>
                      <strong>{notification.status}</strong>
                      <button
                        onClick={() => {
                          const orderStatus = product.status;
                          setSelectedStatus(orderStatus);
                          setSelectedOrder(product);
                        }}>
                        View Order
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        {selectedOrder && (
          <div className="modal-overlay">
            <dialog open className="modal">
              <div className="adminOrders-modal">
                <h2>Order Details</h2>
                <img src={selectedOrder.image} />
                <ul className="adminOrders-user">
                  <li>Buyer Name: {selectedOrder.username}</li>
                  <li>Product Name: {selectedOrder.productName}</li>
                  <li>Price: {selectedOrder.price}</li>
                </ul>
                <div>
                  <strong>Address</strong>
                  <ul>
                    <li>{selectedOrder.userDeliveryDetails.street}</li>
                    <li>{selectedOrder.userDeliveryDetails.state}</li>
                    <li>{selectedOrder.userDeliveryDetails.country}</li>
                    <li>{selectedOrder.userDeliveryDetails.phone}</li>
                  </ul>
                </div>
                <strong>Status: {selectedOrder.status}</strong>
                <div className="adminOrders-button">
                  <div>
                    <select
                      id="status"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}>
                      <option disabled value>
                        Select Status
                      </option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    <button onClick={() => toggleOrderStatus()}>
                      {status}
                    </button>
                  </div>
                  <button onClick={() => setSelectedOrder(null)}>Close</button>
                </div>
                <p className="results">{result}</p>
              </div>
            </dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
