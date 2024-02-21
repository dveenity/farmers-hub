import { FaLeaf } from "react-icons/fa";
import { PiCalendarDuotone } from "react-icons/pi";
import { MdOutlineDiversity1, MdOutlineEngineering } from "react-icons/md";
import { SiAdguard } from "react-icons/si";
import { Link } from "react-router-dom";

const Genesis = () => {
  const Agro = "Agro Farmers' Hub";
  return (
    <div className="genesis">
      <div>
        <h1>{Agro}</h1>
        <div className="genesis-top">
          <div>
            <h2>
              Farmers sell products,
              <br /> Users get the right products
            </h2>
            <p>Modern, fresh and easy to use. Designed for administrators</p>
          </div>
          <div>
            <Link to="/Signup">Sign Up</Link>
            <Link to="/Login">Log In</Link>
          </div>
        </div>
      </div>
      <div className="genesis-body">
        <div>
          <h3>Why use {Agro}?</h3>
          <p>
            Designed for admins. <MdOutlineEngineering />
          </p>
        </div>
        <ul className="genesis-list-one">
          <li>
            <FaLeaf className="genesis-icon" />
            Easy to use
          </li>
          <li>
            <PiCalendarDuotone className="genesis-icon" />
            Flexible
          </li>
          <li>
            <MdOutlineDiversity1 className="genesis-icon" />
            Qualified
          </li>
          <li>
            <SiAdguard className="genesis-icon" />
            Secure
          </li>
        </ul>
        <ul className="genesis-list-two">
          <li>Place Order</li>
          <li>Calender</li>
          <li>Fast Setup</li>
          <li>Search Products</li>
        </ul>
      </div>
      <p className="genesis-foot">©2024 AgroFarmers.inc</p>
    </div>
  );
};

export default Genesis;
