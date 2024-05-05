import axios from "axios";
import { useQuery } from "react-query";
import GoBack from "../../../Custom/GoBack";
import FetchLoader from "../../../Custom/FetchLoader";

const serVer = `https://farmers-hub-backend.vercel.app`;

const AdminSold = () => {
  const token = localStorage.getItem("farm-users-new");

  const {
    data: adminIdData,
    isLoading: adminIdLoading,
    error: adminIdError,
  } = useQuery("adminId", fetchAdminId, {
    enabled: !!token,
  });

  const {
    data: adminSoldProducts,
    isLoading: soldProductsLoading,
    error: soldProductsError,
  } = useQuery(["adminSoldProducts", adminIdData], fetchAdminSoldProducts, {
    enabled: !!adminIdData,
  });

  async function fetchAdminId() {
    try {
      const response = await axios.get(`${serVer}/home`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.name;
    } catch (error) {
      throw new Error("Error fetching admin ID");
    }
  }

  async function fetchAdminSoldProducts() {
    try {
      const response = await axios.get(`${serVer}/delivered/${adminIdData}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error("Error fetching sold products");
    }
  }

  if (adminIdLoading || soldProductsLoading) {
    return <FetchLoader />;
  }

  if (adminIdError || soldProductsError) {
    return <div>Error: {adminIdError || soldProductsError}</div>;
  }

  return (
    <div className="adminOrders">
      <div className="adminOrders-box">
        <GoBack />
        <h1>Sold Products</h1>
        <ul className="adminSold">
          {adminSoldProducts?.map((product) => (
            <li key={product._id}>
              <div>
                <img src={product.image} alt={product.productName} />
                <p>{product.productName}</p>
                <p>{product.price}</p>
              </div>
              <p>{product.status}</p>
              {/* Add other product details here */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminSold;
