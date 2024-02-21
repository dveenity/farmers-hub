import { useEffect, useState } from "react";
import axios from "axios";

const serVer = `https://agro-hub-backend.onrender.com`;
import { Link } from "react-router-dom";

const AdminActivities = () => {
  const [filteredActivityList, setFilteredActivityList] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = `${serVer}/activitiesFetch`;
        const url2 = `${serVer}/home`;

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

        // Retrieve the logged-in user's username
        const responseId = await axios.get(url2, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const loggedInUser = responseId.data;

        //Filter products based on the username
        const filteredActivities = allActivities.filter(
          (activity) => activity.username === loggedInUser.username
        );
        setFilteredActivityList(filteredActivities);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>My Activities</h1>
      <ul>
        {filteredActivityList.map((activity, index) => (
          <li key={index}>
            <Link>
              <p>{activity.name}</p>
              <p>{activity.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminActivities;
