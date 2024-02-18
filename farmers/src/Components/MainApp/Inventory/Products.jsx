import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../../Custom/Navigation";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = "http://localhost:7001/productsFetch";

        // Retrieve the token from local storage
        const token = localStorage.getItem("farm-users");

        // Fetch products from the server
        const response = await axios.post(url, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the fetched products into the state
        setProductList(response.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Function to handle clicking on the "Read More" button
  const handleReadMore = (product) => {
    // Navigate to the product details page with the encoded product name
    navigate(`/product/${product._id}`);
  };

  return (
    <div>
      <h1>All Products</h1>
      <ul>
        {productList.map((product, i) => (
          <li key={i}>
            <div>
              <p>{product.name}</p>
              <p>{product.price}</p>
              {/* Pass product name to handleReadMore */}
              <button onClick={() => handleReadMore(product)}>Read More</button>
            </div>
          </li>
        ))}
      </ul>
      <Navigation />
    </div>
  );
};

export default Products;
