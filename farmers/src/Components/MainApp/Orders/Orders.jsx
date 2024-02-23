import { useState } from "react";
import axios from "axios";
import { useQuery, useMutation } from "react-query";
import Navigation from "../../Custom/Navigation";
import FetchLoader from "../../Custom/FetchLoader";
import { FcIdea } from "react-icons/fc";
import { TbCurrencyNaira } from "react-icons/tb";
import LoadingSpin from "../../Custom/LoadingSpin";

const serVer = `https://farmers-hub-backend.vercel.app`;

const Orders = () => {
  const [modal, setModal] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState(null);
  const [cancelButton, setCancelButton] = useState("Yes");

  const token = localStorage.getItem("farm-users-new");

  // Fetch user data
  const fetchUser = async () => {
    const url = `${serVer}/home`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  // Fetch orders
  const fetchOrders = async (name) => {
    try {
      const url = `${serVer}/ordersUser/${name}`;
      const response = await axios.get(url, {
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
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useQuery("user", fetchUser);
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useQuery("orders", () => fetchOrders(userData?.name), {
    enabled: !!userData?.name,
  });

  const deleteOrderMutation = useMutation(
    (orderId) => {
      const url = `${serVer}/order/${orderId}`;
      return axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    {
      onSuccess: () => {
        refetchOrders();
        closeModal();
      },
    }
  );

  const toggleModal = (order) => {
    setModal((prevView) => !prevView);
    setOrderIdToDelete(order);
  };

  const closeModal = () => {
    setModal(false);
  };

  const handleCancelOrder = async () => {
    try {
      setCancelButton(<LoadingSpin />);
      await deleteOrderMutation.mutateAsync(orderIdToDelete);
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setCancelButton("Yes");
    }
  };

  if (isUserLoading || isOrdersLoading) return <FetchLoader />;
  if (isUserError || isOrdersError) return <div>Error fetching data</div>;

  const orders = ordersData || [];

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
          {orders.length === 0 ? (
            <p>No orders yet?... Place an order and manage it here</p>
          ) : (
            <ul>
              {orders.map((order) => (
                <li key={order._id}>
                  <div>
                    <img src={order.image} alt={order.productName} />
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
                    <button onClick={() => toggleModal(order._id)}>
                      Cancel Order
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {modal && (
        <div className="modal-overlay">
          <dialog open className="modal">
            <div className="orders-modal">
              <h4>Are you sure?</h4>
              <div>
                <button onClick={handleCancelOrder}>{cancelButton}</button>
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
