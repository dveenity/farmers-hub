import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../../Custom/Navigation";
import { Link } from "react-router-dom";

const Activities = () => {
  const [activityList, setActivityList] = useState();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = "http://localhost:7001/activitiesFetch";

        // Retrieve the token from local storage
        const token = localStorage.getItem("farm-users");

        // Fetch products from the server
        const response = await axios.post(url, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Set the fetched products into the state

        const allActivities = response.data;

        const activity = allActivities.map((activity, i) => (
          <li key={i}>
            <Link>
              <p>{activity.name}</p>
              <p>{activity.description}</p>
            </Link>
          </li>
        ));

        setActivityList(activity);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>All Activities</h1>
      <ul>{activityList}</ul>
      <Navigation />
    </div>
  );
};

export default Activities;
