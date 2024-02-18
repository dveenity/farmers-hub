import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [productName, setProductName] = useState(null);
  const [productDescription, setProductDescription] = useState(null);
  const [productPrice, setProductPrice] = useState(null);
  const [productOwner, setProductOwner] = useState(null);
  const navigate = useNavigate();

  // State to store the user's role
  const [username, setUsername] = useState("");

  useEffect(() => {
    const url = "http://localhost:7001/home";

    // Retrieve the token from local storage
    const token = localStorage.getItem("farm-users");

    // Fetch the user's role from the server
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = response;
        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const url = `http://localhost:7001/product/${productId}`;

        // Fetch product details from the server
        const response = await axios.get(url);

        const { data } = response;

        // Set the fetched product details into state
        setProductName(data.name);
        setProductDescription(data.description);
        setProductPrice(data.price);
        setProductOwner(data.username);
      } catch (error) {
        console.log("Error fetching product details:", error);
        setProduct(error.response.data);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // function to handle order, send notification to owner
  const handleOrderNow = async () => {
    try {
      // 1. Add Order to User Order History
      const orderData = {
        username,
        productId,
        productName,
        productPrice,
      };

      // Send a request to your server to add the order to the user's order history
      const orderResponse = await axios.post(
        "http://localhost:7001/orders",
        orderData
      );

      // Check if the order was successfully added
      if (orderResponse.status === 200) {
        // Handle success
        setProduct("Order placed successfully");
        setTimeout(() => {
          setProduct(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  // function delete product per poster request
  const handleDelete = async () => {
    try {
      const url = `http://localhost:7001/product/${productId}`;

      // Send delete request to the server
      const response = await axios.delete(url);

      // Check if the delete request was successful
      if (response.status === 200) {
        // Handle success
        setProduct("deleted successfully");
        // Optionally, you can navigate the user back to the product listing page
        navigate(-1);
      } else {
        // Handle error
        console.error("Error deleting product:", response.data);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div>
      <h1>Product Details</h1>
      <p>Product Name: {productName}</p>
      <p>Description: {productDescription}</p>
      <p>Price: {productPrice}</p>
      <p>Posted by: {username === productOwner ? "You" : productOwner}</p>
      {username === productOwner ? (
        <button onClick={handleDelete}>Delete</button>
      ) : (
        <button onClick={handleOrderNow}>Order Now</button>
      )}
      <p>{product}</p>
    </div>
  );
};

export default ProductDetails;
