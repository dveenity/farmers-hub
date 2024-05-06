import GoBack from "../../../Custom/GoBack";
import { useLocation } from "react-router-dom";

const AdminSold = () => {
  // Access data passed via link from adminHome component
  const location = useLocation();

  const { state } = location;
  const { deliveredOrdersData } = state;
  const adminSoldProducts = deliveredOrdersData;

  const hasSoldProducts = adminSoldProducts?.length > 0;

  return (
    <div className="adminOrders">
      <div className="adminOrders-box">
        <GoBack />
        <h1>Sold Products</h1>
        <ul className="adminSold">
          {hasSoldProducts ? (
            adminSoldProducts?.map((product) => (
              <li key={product._id}>
                <div>
                  <img src={product.image} alt={product.productName} />
                  <p>{product.productName}</p>
                  <p>{product.price}</p>
                </div>
                <p>{product.status}</p>
                {/* Add other product details here */}
              </li>
            ))
          ) : (
            <p>
              You can track your sold/delivered products here, No products sold
              or successfully delivered yet!
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminSold;
