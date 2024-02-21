import { useState } from "react";
import Products from "./Products";
import Activities from "./Activities";
import { FaCartShopping } from "react-icons/fa6";
import { RxActivityLog } from "react-icons/rx";
import { FcIdea } from "react-icons/fc";

const Inventory = () => {
  const [isProductsView, setIsProductsView] = useState(true);
  const [isActivityView, setIsActivityView] = useState(false);

  // Function to toggle between products and activities views
  const toggleProducts = () => {
    setIsProductsView(true);
    setIsActivityView(false);
  };

  const toggleActivity = () => {
    setIsActivityView(true);
    setIsProductsView(false);
  };

  return (
    <div className="inventory">
      <div className="tip">
        <FcIdea />
        <p>Tip: Click to toggle products & activities view</p>
      </div>
      <div className="inventory-switch">
        {/* Button to switch between products and activities views */}
        <button onClick={toggleProducts}>
          Products
          <FaCartShopping />
        </button>
        <button onClick={toggleActivity}>
          Activities
          <RxActivityLog />
        </button>
      </div>

      {/* Render Products or Activities based on the selected view */}
      {isProductsView && <Products />}
      {isActivityView && <Activities />}
    </div>
  );
};

export default Inventory;
