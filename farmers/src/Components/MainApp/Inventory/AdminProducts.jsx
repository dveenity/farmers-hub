import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const [filteredProductList, setFilteredProductList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = "http://localhost:7001/productsFetch";
        const url2 = "http://localhost:7001/home";

        // Retrieve the token from local storage
        const token = localStorage.getItem("farm-users");

        // Fetch products from the server
        const response = await axios.post(url, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the fetched products into the state
        const allProducts = response.data;

        // Retrieve the logged-in user's username
        const responseId = await axios.get(url2, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const loggedInUser = responseId.data;

        //Filter products based on the username
        const filteredProducts = allProducts.filter(
          (product) => product.username === loggedInUser.username
        );
        setFilteredProductList(filteredProducts);
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
      <h1>My Products</h1>
      <ul>
        {filteredProductList.map((product, index) => (
          <li key={index}>
            <p>{product.name}</p>
            <p>{product.price}</p>
            {/* Pass product name to handleReadMore */}
            <button onClick={() => handleReadMore(product)}>Read More</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProducts;
