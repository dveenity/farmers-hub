import { useEffect, useState } from "react";
import axios from "axios";

const serVer = `https://farmers-hub-backend.vercel.app`;

const AdminSold = () => {
  const [adminSoldProducts, setAdminSoldProducts] = useState([]);
  const [adminId, setAdminId] = useState(null); // admin ID
  const token = localStorage.getItem("farm-users");

  useEffect(() => {
    // Fetch admin ID
    const fetchAdminId = async () => {
      try {
        const response = await axios.get(`${serVer}/home`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { username } = response.data;
        setAdminId(username);
      } catch (error) {
        console.error("Error fetching admin ID:", error);
      }
    };

    fetchAdminId();
  }, [token]);

  useEffect(() => {
    // Fetch sold products associated with the admin ID
    const fetchAdminSoldProducts = async () => {
      try {
        const response = await axios.get(`${serVer}/delivered/${adminId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = response;
        setAdminSoldProducts(data);
      } catch (error) {
        console.error("Error fetching sold products:", error);
      }
    };

    if (adminId) {
      fetchAdminSoldProducts();
    }
  }, [adminId, token]);

  return (
    <div>
      <h1>Sold Products</h1>
      <ul>
        {adminSoldProducts.map((product) => (
          <li key={product._id}>
            <p>Product Name: {product.productName}</p>
            <p>Price: {product.price}</p>
            <p>Status: {product.status}</p>
            {/* Add other product details here */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSold;
