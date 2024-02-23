import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import Navigation from "../../Custom/Navigation";
import { TbCurrencyNaira } from "react-icons/tb";
import FetchLoader from "../../Custom/FetchLoader";
import LoadingSpin from "../../Custom/LoadingSpin";

const serVer = `https://farmers-hub-backend.vercel.app`;

const Products = () => {
  const {
    data: productList,
    isLoading,
    error,
    refetch,
  } = useQuery("products", fetchProducts);

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
  const [username, setUsername] = useState("");
  const [orderButton, setOrderButton] = useState("Order Now");
  const [deleteButton, setDeleteButton] = useState("Delete");

  useEffect(() => {
    const token = localStorage.getItem("farm-users-new");

    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${serVer}/home`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = response;
        setUsername(data.name);
        setUserAddress(data.address);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUserRole();
  }, []);

  const handleReadMore = (product) => {
    setModal((prevView) => !prevView);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price);
    setProductOwner(product.username);
    setProductId(product._id);
    setProductImage(product.image);
  };

  const handleOrderNow = async () => {
    try {
      setOrderButton(<LoadingSpin />);
      if (!userAddress) {
        setProduct("Please update your address before placing orders");
        setTimeout(() => {
          setProduct(null);
        }, 5000);
        return;
      }

      const orderData = {
        username,
        productId,
        productName,
        productPrice,
        productImage,
        userAddress,
      };

      const orderResponse = await axios.post(`${serVer}/orders`, orderData);

      if (orderResponse.status === 200) {
        setProduct("Order placed successfully");
        setTimeout(() => {
          setProduct(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setOrderButton("Order Now");
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteButton(<LoadingSpin />);
      const url = `${serVer}/product/${productId}`;
      const response = await axios.delete(url);

      if (response.status === 200) {
        await refetch(); // Re-fetch products after deletion
        setModal(false);
      } else {
        console.error("Error deleting product:", response.data);
        setProduct("failed, try again");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setProduct("error, try again");
    } finally {
      setDeleteButton("Delete");
    }
  };

  return (
    <div className="products">
      <div className="products-top">
        <h2>All Products</h2>
        <p>Sorted by recently posted</p>
      </div>
      {isLoading ? (
        <FetchLoader />
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <ul className="products-list">
          {productList.map((product, i) => (
            <li key={i}>
              <div>
                <img src={product.image} alt={product.name} />
                <div>
                  <h4>{product.name}</h4>
                  <h4>
                    <TbCurrencyNaira />
                    {product.price}
                  </h4>
                </div>
                <button onClick={() => handleReadMore(product)}>View</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {modal && (
        <div className="modal-overlay">
          <dialog open className="modal">
            <div className="modal-products">
              <h3>Product Details</h3>
              <img src={productImage} alt={productName} />
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
                  <p>{productDescription}</p>
                  <strong>
                    Posted by:{" "}
                    {username === productOwner ? "You" : productOwner}
                  </strong>
                </div>
                <div>
                  {username === productOwner ? (
                    <button onClick={handleDelete}>{deleteButton}</button>
                  ) : (
                    <button onClick={handleOrderNow}>{orderButton}</button>
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

async function fetchProducts() {
  try {
    const url = `${serVer}/productsFetch`;
    const response = await axios.post(url);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching products");
  }
}

export default Products;
