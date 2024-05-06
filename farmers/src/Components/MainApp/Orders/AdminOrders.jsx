import { useState } from "react";
import axios from "axios";
import GoBack from "../../Custom/GoBack";
import LoadingSpin from "../../Custom/LoadingSpin";
import { useLocation } from "react-router-dom";
import { fetchAdminOrders } from "../../Hooks/useFetch";
import { useQuery } from "react-query";
import FetchLoader from "../../Custom/FetchLoader";

const serVer = `https://farmers-hub-backend.vercel.app`;

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("Update Status");

  // Access data passed via link from adminHome component
  const location = useLocation();
  const { state } = location;
  const { name } = state;

  // Fetch admin Orders
  const {
    data: ordersData,
    isLoading: ordersIsLoading,
    isError: ordersIsError,
    refetch: refetchOrders,
  } = useQuery("adminOrders", () => fetchAdminOrders(name));

  if (ordersIsLoading) {
    return <FetchLoader />;
  }

  if (ordersIsError) {
    return <div>Error fetching data</div>;
  }

  const hasOrders = ordersData?.length > 0;

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

        setSelectedOrder(false);
      } else {
        await setResult("Status updated");
        await refetchOrders();
        setSelectedOrder(false);
      }
    } catch (error) {
      setResult("Failed! try again");
    } finally {
      setStatus("Update Status");

      setTimeout(() => {
        setResult(null);
      }, 3000);
    }
  };

  return (
    <div className="adminOrders">
      <div className="adminOrders-box">
        <GoBack />
        <h1>
          Order Notifications <span>{ordersData.length}</span>
        </h1>
        <ul className="admin-notification">
          {hasOrders ? (
            ordersData.map((product) => (
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
            ))
          ) : (
            <p>
              View and manage your new and pending orders here! <br />
              You currently have no new orders
            </p>
          )}
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
