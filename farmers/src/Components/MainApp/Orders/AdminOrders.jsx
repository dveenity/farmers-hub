import { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import GoBack from "../../Custom/GoBack";
import LoadingSpin from "../../Custom/LoadingSpin";
import FetchLoader from "../../Custom/FetchLoader";

const serVer = `https://farmers-hub-backend.vercel.app`;

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("Update Status");

  const token = localStorage.getItem("farm-users");

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${serVer}/home`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Error fetching user data");
    }
  };

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery("user", fetchUserData);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${serVer}/orders/${userData.name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Error fetching orders");
    }
  };

  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery("orders", fetchOrders, {
    enabled: !!userData,
  });

  const toggleOrderStatus = async () => {
    try {
      setStatus(<LoadingSpin />);
      if (!selectedOrder || !selectedStatus) {
        return;
      }

      await axios.put(`${serVer}/orders/${selectedOrder._id}`, {
        status: selectedStatus,
      });

      if (selectedStatus === "Delivered") {
        await axios.put(`${serVer}/deliver-product/${selectedOrder._id}`);

        setResult("Order moved to Sold");
        setTimeout(() => {
          setResult("");
        }, 2000);

        await refetchOrders();

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
    } finally {
      setStatus("Update Status");
    }
  };

  if (userLoading || ordersLoading) {
    return <FetchLoader />;
  }

  if (userError || ordersError) {
    return <div>Error: {userError || ordersError}</div>;
  }

  return (
    <div className="adminOrders">
      <div className="adminOrders-box">
        <GoBack />
        <h1>
          Order Notifications <span>{ordersData.length}</span>
        </h1>
        <ul className="admin-notification">
          {ordersData.map((product) => (
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
                <img src={selectedOrder.image} alt="Order" />
                <ul className="adminOrders-user">
                  <li>Buyer Name: {selectedOrder.username}</li>
                  <li>Product Name: {selectedOrder.productName}</li>
                  <li>Price: {selectedOrder.price}</li>
                </ul>
                <div>
                  <strong>Address</strong>
                  <ul className="adminOrders-address">
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
