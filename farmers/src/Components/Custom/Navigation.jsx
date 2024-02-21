import { FaCreditCard, FaHome, FaUser } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  //create home nav object and map into a list
  const navigation = [
    { name: "Home", icon: <FaHome />, link: "/home" },
    { name: "Inventory", icon: <MdInventory />, link: "/inventory" },
    { name: "Orders", icon: <FaCreditCard />, link: "/orders" },
    { name: "Profile", icon: <FaUser />, link: "/profile" },
  ];
  const navList = navigation.map((nav, index) => (
    <li key={index}>
      <NavLink to={nav.link} activeclassname="active">
        <div className="icon">{nav.icon}</div>
        <div>{nav.name}</div>
      </NavLink>
    </li>
  ));

  return (
    <div className="home-nav">
      <ul>{navList}</ul>
    </div>
  );
};

export default Navigation;
