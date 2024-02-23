import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const serVer = `https://farmers-hub-backend.vercel.app`;
import GoBack from "../../Custom/GoBack";
import { TbCurrencyNaira } from "react-icons/tb";

const Purchases = () => {
  const [result, setResult] = useState("");
  const [userPurchasedProducts, setUserPurchasedProducts] = useState(null);
  const [userId, setUserId] = useState(null); // admin ID

  useEffect(() => {
    const token = localStorage.getItem("farm-users-new");
    // Fetch admin ID
    const fetchUserId = async () => {
      try {
        const response = await axios.get(`${serVer}/home`, {
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
  }, []);

  // Fetch sold products associated with the user ID
  const fetchUserPurchases = useCallback(async () => {
    const token = localStorage.getItem("farm-users-new");
    try {
      const response = await axios.get(`${serVer}/purchased/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = response;

      if (data.length === 0) {
        setResult("No successful purchases/deliveries yet");
      } else {
        const purchaseOut = data.map((product) => (
          <li key={product._id}>
            <div>
              <img src={product.image} alt={product.productName} />
              <p>{product.productName}</p>
              <p>
                <TbCurrencyNaira />
                {product.price}
              </p>
            </div>
            <strong>{product.status}</strong>
            {/* Add other product details here */}
          </li>
        ));
        setUserPurchasedProducts(purchaseOut);
      }
    } catch (error) {
      console.error("Error fetching sold products:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserPurchases();
  }, [fetchUserPurchases]);

  return (
    <div className="purchased">
      <div className="purchased-box">
        <div>
          <GoBack />
          <h1>Purchased</h1>
        </div>
        <ul>{userPurchasedProducts}</ul>
        <p>{result}</p>
      </div>
    </div>
  );
};

export default Purchases;
