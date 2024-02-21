import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../../Custom/Navigation";
import { TbCurrencyNaira } from "react-icons/tb";

const Products = () => {
  const [productList, setProductList] = useState(null);
  const [modal, setModal] = useState(false);
  const [product, setProduct] = useState(null);
  const [productId, setProductId] = useState(null);
  const [productName, setProductName] = useState(null);
  const [productDescription, setProductDescription] = useState(null);
  const [productPrice, setProductPrice] = useState(null);
  const [productOwner, setProductOwner] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [userAddress, setUserAddress] = useState({
    street: "",
    state: "",
    country: "",
    phone: "",
  });

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
        setUserAddress(data.address);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUserRole();
  }, []);

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

      const { data } = response;

      const productsOut = data.map((product, i) => (
        <li key={i}>
          <div>
            <img src={product.image} />
            <div>
              <h4>{product.name}</h4>
              <h4>
                <TbCurrencyNaira />
                {product.price}
              </h4>
            </div>
            {/* Pass product name to handleReadMore */}
            <button onClick={() => handleReadMore(product)}>View</button>
          </div>
        </li>
      ));
      //check if empty
      if (productsOut.length === 0) {
        setProductList(
          <div className="products-list-none">No Products posted yet</div>
        );
      } else {
        // Set the fetched products into the state
        setProductList(productsOut);
      }
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  useState(() => {
    fetchProducts();
  }, []);

  // Function to handle clicking on the "Read More" button
  const handleReadMore = (product) => {
    setModal((prevView) => !prevView);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price);
    setProductOwner(product.username);
    setProductId(product._id);
    setProductImage(product.image);
  };

  // function to handle order, send notification to owner
  const handleOrderNow = async () => {
    try {
      // 1. Check if user address is available
      if (!userAddress) {
        setProduct("Please update your address before placing orders");

        setTimeout(() => {
          setProduct(null);
        }, 5000);
        return;
      }

      // 1. Add Order to User Order History
      const orderData = {
        username,
        productId,
        productName,
        productPrice,
        productImage,
        userAddress,
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
        //fetch and update the page again
        await fetchProducts();

        //close Modal
        setModal(false);
        // Optionally, you can navigate the user back to the product listing page
      } else {
        // Handle error
        console.error("Error deleting product:", response.data);
        setProduct("failed, try again");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setProduct("error, try again");
    }
  };

  return (
    <div className="products">
      <div className="products-top">
        <h2>All Products</h2>
        <p>Sorted by recently posted</p>
      </div>
      <ul className="products-list">{productList}</ul>
      {modal && (
        <div className="modal-overlay">
          <dialog open className="modal">
            <div className="modal-products">
              <h3>Product Details</h3>
              <img src={productImage} />
              <div className="modal-products-details">
                <div>
                  <h4>{productName}</h4>
                  <h4>
                    <TbCurrencyNaira />
                    {productPrice}
                  </h4>
                </div>
                <div>
                  <h5>Description</h5>
                  <p> {productDescription}</p>
                  <strong>
                    Posted by:{" "}
                    {username === productOwner ? "You" : productOwner}
                  </strong>
                </div>
                <div>
                  {username === productOwner ? (
                    <button onClick={handleDelete}>Delete</button>
                  ) : (
                    <button onClick={handleOrderNow}>Order Now</button>
                  )}
                  <button onClick={handleReadMore}>Close</button>
                </div>
              </div>
              <p>{product}</p>
            </div>
          </dialog>
        </div>
      )}
      <Navigation />
    </div>
  );
};

export default Products;
