import GoBack from "../../Custom/GoBack";
import { TbCurrencyNaira } from "react-icons/tb";
import { useLocation } from "react-router-dom";
import { fetchUserPurchases } from "../../Hooks/useFetch";
import FetchLoader from "../../Custom/FetchLoader";
import { useQuery } from "react-query";

const Purchases = () => {
  // Access data passed via link from adminHome component
  const location = useLocation();
  const { state } = location;
  const { name } = state;

  // Fetch products
  const {
    data: purchasesData,
    isLoading: purchasesIsLoading,
    isError: purchasesIsError,
  } = useQuery("purchases", () => fetchUserPurchases(name));

  if (purchasesIsLoading) {
    return <FetchLoader />;
  }

  if (purchasesIsError) {
    return <div>Error fetching data</div>;
  }

  const hasPurchases = purchasesData?.length > 0;

  const purchaseOut = purchasesData.map((product) => (
    <li key={product._id}>
      <div>
        <img src={product.image} alt={product.productName} />
        <p>{product.productName}</p>
        <p>
          <TbCurrencyNaira />
          {product.price}
        </p>
      </div>
      <strong>{product.status}</strong>
      {/* Add other product details here */}
    </li>
  ));

  return (
    <div className="purchased">
      <div className="purchased-box">
        <div>
          <GoBack />
          <h1>Purchased</h1>
        </div>
        <ul>
          {hasPurchases ? (
            purchaseOut
          ) : (
            <p>
              Manage and view your successful deliveries here,
              <br />
              No successful purchase/delivery yet
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Purchases;
