import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { TbCurrencyNaira } from "react-icons/tb";
import FetchLoader from "../../Custom/FetchLoader";
import LoadingSpin from "../../Custom/LoadingSpin";
import { fetchProducts } from "../../Hooks/useFetch";
import PropTypes from "prop-types";

const serVer = `https://farmers-hub-backend.vercel.app`;

const Products = ({ user }) => {
  // receive user data props from inventory component
  useEffect(() => {
    const name = user[0];
    const address = user[1];

    setUsername(name);
    setUserAddress(address);
  }, [user]);

  const [username, setUsername] = useState("");
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
  const [orderButton, setOrderButton] = useState("Order Now");
  const [deleteButton, setDeleteButton] = useState("Delete");

  // Fetch products
  const {
    data: productsData,
    isLoading: productsIsLoading,
    isError: productsIsError,
    refetch,
  } = useQuery("products", fetchProducts);

  useEffect(() => {
    if (productsIsLoading) {
      return <FetchLoader />;
    }

    if (productsIsError) {
      return <div>Error fetching data</div>;
    }
  }, [productsIsLoading, productsIsError]);

  const hasProducts = productsData?.length > 0;

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

      <ul className="products-list">
        {hasProducts ? (
          productsData.map((product) => {
            let name = product.name;
            if (name.length > 10) {
              name = name.split(" ");
              name = name[0] + " " + name[1];
            }

            return (
              <li key={product._id}>
                <img src={product.image} alt={product.name} />
                <div>
                  <h4>{name}</h4>
                  <h4>
                    <TbCurrencyNaira />
                    {product.price}
                  </h4>
                </div>
                <button onClick={() => handleReadMore(product)}>View</button>
              </li>
            );
          })
        ) : (
          <p>
            No products available yet <br />
            Products posted by farmers will appear here
          </p>
        )}
      </ul>

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
    </div>
  );
};

Products.propTypes = {
  user: PropTypes.array.isRequired,
};

export default Products;
