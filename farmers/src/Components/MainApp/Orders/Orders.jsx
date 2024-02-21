import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../../Custom/Navigation";
import { FcIdea } from "react-icons/fc";
import { TbCurrencyNaira } from "react-icons/tb";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [modal, setModal] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState(null);

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

  //fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      if (!userId) return;

      const url = `http://localhost:7001/ordersUser/${userId}`;

      const response = await axios.get(url);
      const { data } = response;

      const ordersOut = data.map((order, index) => (
        <li key={index}>
          <div>
            <img src={order.image} />
            <h4>{order.productName}</h4>
            <h4>
              <TbCurrencyNaira />
              {order.price}
            </h4>
          </div>
          <div>
            <strong>
              status: <span>{order.status}</span>
            </strong>
            <button onClick={() => toggleModal(order)}>Cancel Order</button>
          </div>
        </li>
      ));

      if (data.length === 0) {
        setOrders(<div>No orders yet, place an order and view it here</div>);
      } else {
        setOrders(ordersOut);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]); // Add 'result' to the dependency array

  const handleCancelOrder = async () => {
    try {
      const url = `http://localhost:7001/order/${orderIdToDelete}`;
      const response = await axios.delete(url);

      if (response.status === 200) {
        //refresh page
        await fetchOrders();

        //close Modal
        closeModal();
      } else {
        console.error("Error deleting product:", response.data);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // open Modal
  const toggleModal = (order) => {
    setModal((prevView) => !prevView);
    setOrderIdToDelete(order._id);
  };

  //close modal
  const closeModal = () => {
    setModal(false);
  };

  return (
    <div className="orders">
      <div className="tip">
        <FcIdea />
        <p>
          Tip: View and track your order status, delivered orders are moved to
          purchased
        </p>
      </div>
      <div className="orders-sect">
        <h1>My Orders</h1>
        <div>
          <ul>{orders}</ul>
        </div>
      </div>
      {modal && (
        <div className="modal-overlay">
          <dialog open className="modal">
            <div className="orders-modal">
              <h4>Are you sure?</h4>
              <div>
                <button onClick={handleCancelOrder}>Yes</button>
                <button onClick={closeModal}>No</button>
              </div>
            </div>
          </dialog>
        </div>
      )}
      <Navigation />
    </div>
  );
};

export default Orders;
