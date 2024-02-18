import { useState } from "react";
import Products from "./Products";
import Activities from "./Activities";

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
    <div>
      {/* Button to switch between products and activities views */}
      <button onClick={toggleProducts}>Products</button>
      <button onClick={toggleActivity}>Activities</button>

      {/* Render Products or Activities based on the selected view */}
      {isProductsView && <Products />}
      {isActivityView && <Activities />}
    </div>
  );
};

export default Inventory;
