import { useEffect, useState } from "react";
import axios from "axios";

const Purchases = () => {
  const [result, setResult] = useState("");
  const [userPurchasedProducts, setUserPurchasedProducts] = useState([]);
  const [userId, setUserId] = useState(null); // admin ID
  const token = localStorage.getItem("farm-users");

  useEffect(() => {
    // Fetch admin ID
    const fetchUserId = async () => {
      try {
        const response = await axios.get("http://localhost:7001/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { username } = response.data;
        setUserId(username);
      } catch (error) {
        console.error("Error fetching admin ID:", error);
      }
    };

    fetchUserId();
  }, [token]);

  useEffect(() => {
    // Fetch sold products associated with the admin ID
    const fetchUserPurchases = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7001/purchased/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { data } = response;
        if (data.length === 0) {
          setResult("no successful purchase/deliveries yet");
        } else {
          setUserPurchasedProducts(data);
        }
      } catch (error) {
        console.error("Error fetching sold products:", error);
      }
    };

    if (userId) {
      fetchUserPurchases();
    }
  }, [userId, token]);

  return (
    <div>
      <h1>Purchased</h1>
      <ul>
        {userPurchasedProducts.map((product) => (
          <li key={product._id}>
            <p>Product Name: {product.productName}</p>
            <p>Price: {product.price}</p>
            <p>Status: {product.status}</p>
            {/* Add other product details here */}
          </li>
        ))}
      </ul>
      <p>{result}</p>
    </div>
  );
};

export default Purchases;
