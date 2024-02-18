import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <div>
      <div>
        <p>What would you like to do today</p>
        <div>
          <div>
            <Link to="/addProduct">Add New Products</Link>
          </div>
          <div>
            <Link to="/addActivity">Add New Farm Activity</Link>
          </div>
          <div>
            <Link to="/adminProducts">View your Products</Link>
          </div>
          <div>
            <Link to="/adminActivities">View your Activities</Link>
          </div>
          <div>
            <Link to="/adminOrders">View New Orders</Link>
          </div>
          <div>
            <Link to="/addCalender">Product Calender</Link>
          </div>
          <div>
            <Link to="/soldOrder">View Sold</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
