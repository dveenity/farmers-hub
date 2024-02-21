import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const serVer = `https://agro-hub-backend.onrender.com`;
import Navigation from "../../Custom/Navigation";

const Activities = () => {
  const [activityList, setActivityList] = useState();
  const [modal, setModal] = useState(false);
  const [activityImage, setActivityImage] = useState(null);
  const [activityName, setActivityName] = useState(null);
  const [activityDescription, setActivityDescription] = useState(null);
  const [activityOwner, setActivityOwner] = useState(null);
  const [username, setUsername] = useState(null);
  const [activityId, setActivityId] = useState(null);
  const [product, setProduct] = useState(null);

  // Retrieve the token from local storage
  const token = localStorage.getItem("farm-users");

  // fetch user name and store in state
  useEffect(() => {
    const url = `${serVer}/home`;

    // Fetch the user's role from the server
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = response;
        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUserRole();
  }, [token]);

  const fetchProducts = useCallback(async () => {
    try {
      const url = `${serVer}/activitiesFetch`;

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
          <img src={activity.image} alt={activity.name} />
          <div>
            <h3>{activity.name}</h3>
            <button onClick={() => handleActivity(activity)}>Read more</button>
          </div>
        </li>
      ));

      setActivityList(activity);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // modal
  const handleActivity = (activity) => {
    setModal((prevView) => !prevView);
    setActivityImage(activity.image);
    setActivityName(activity.name);
    setActivityDescription(activity.description);
    setActivityOwner(activity.username);
    setActivityId(activity._id);
  };

  // handle activity delete
  const handleDelete = async () => {
    try {
      const url = `${serVer}/activity/${activityId}`;

      // Send delete request to the server
      const response = await axios.delete(url);

      // Check if the delete request was successful
      if (response.status === 200) {
        //fetch and update the page again
        await fetchProducts();

        //close Modal
        setModal(false);
        // Optionally, you can navigate the user back to the product listing page
      } else {
        // Handle error
        console.error("Error deleting product:", response.data);
        setProduct("failed, try again");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setProduct("error, try again");
    }
  };

  return (
    <div className="activities">
      <div className="activities-top">
        <h1>All Activities</h1>
        <p>Sorted by recently posted</p>
      </div>
      <ul className="activitiesList">{activityList}</ul>
      {modal && (
        <div className="modal-overlay">
          <dialog open className="modal">
            <div className="modal-products">
              <h3>Activity Details</h3>
              <img src={activityImage} />
              <div className="modal-products-details">
                <h3>{activityName}</h3>
                <div>
                  <h5>Description</h5>
                  <p> {activityDescription}</p>
                  <strong>
                    Posted by:{" "}
                    {username === activityOwner ? "You" : activityOwner}
                  </strong>
                </div>
                <div>
                  {username === activityOwner && (
                    <button onClick={handleDelete}>Delete</button>
                  )}
                  <button onClick={handleActivity}>Close</button>
                </div>
              </div>
              <p>{product}</p>
            </div>
          </dialog>
        </div>
      )}
      <Navigation />
    </div>
  );
};

export default Activities;
