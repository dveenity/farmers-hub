import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { TbCurrencyNaira } from "react-icons/tb";
import FetchLoader from "../../Custom/FetchLoader";
import LoadingSpin from "../../Custom/LoadingSpin";

const serVer = `https://farmers-hub-backend.vercel.app`;

const AdminProducts = () => {
  const {
    data: productList,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useQuery("products", fetchProducts);
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery("userRole", fetchUserRole);

  const [modal, setModal] = useState(false);
  const [product, setProduct] = useState(null);
  const [productId, setProductId] = useState(null);
  const [productName, setProductName] = useState(null);
  const [productDescription, setProductDescription] = useState(null);
  const [productPrice, setProductPrice] = useState(null);
  const [productOwner, setProductOwner] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [deleteButton, setDeleteButton] = useState("Delete");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (userData) {
      setUsername(userData.name);
    }
  }, [userData]);

  const handleReadMore = (product) => {
    setModal((prevView) => !prevView);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price);
    setProductOwner(product.username);
    setProductId(product._id);
    setProductImage(product.image);
  };

  const handleDelete = async () => {
    try {
      setDeleteButton(<LoadingSpin />);
      const url = `${serVer}/product/${productId}`;
      const response = await axios.delete(url);

      if (response.status === 200) {
        await refetchProducts(); // Re-fetch products after deletion
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

  if (productsLoading || userLoading) {
    return <FetchLoader />;
  }

  if (productsError || userError) {
    return <div>Error: {productsError || userError}</div>;
  }

  // Filter productList based on username
  const filteredProducts = productList?.filter(
    (product) => product.username === username
  );

  return (
    <div className="products">
      <div className="products-top">
        <h2>Admin Products</h2>
        <p>Sorted by recently posted</p>
      </div>
      <ul className="products-list">
        {filteredProducts.map((product, i) => (
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
                    Posted by: {username === productOwner && "You"}
                  </strong>
                </div>
                <div>
                  {username === productOwner && (
                    <button onClick={handleDelete}>{deleteButton}</button>
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

async function fetchProducts() {
  try {
    const url = `${serVer}/productsFetch`;
    const response = await axios.post(url);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching products");
  }
}

async function fetchUserRole() {
  try {
    const token = localStorage.getItem("farm-users-new");
    const response = await axios.get(`${serVer}/home`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching user");
  }
}

export default AdminProducts;
