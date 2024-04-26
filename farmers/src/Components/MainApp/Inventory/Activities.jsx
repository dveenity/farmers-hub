import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import FetchLoader from "../../Custom/FetchLoader";

const serVer = `https://farmers-hub-backend.vercel.app`;

const Activities = () => {
  const [modal, setModal] = useState(false);
  const [activityImage, setActivityImage] = useState(null);
  const [activityName, setActivityName] = useState(null);
  const [activityDescription, setActivityDescription] = useState(null);
  const [activityOwner, setActivityOwner] = useState(null);
  const [username, setUsername] = useState(null);
  const [activityId, setActivityId] = useState(null);
  const [product, setProduct] = useState(null);

  const token = localStorage.getItem("farm-users-new");

  const {
    data: activityList,
    isLoading,
    error,
    refetch,
  } = useQuery("activities", fetchActivities);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(`${serVer}/home`, {
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

  const handleActivity = (activity) => {
    setModal((prevView) => !prevView);
    setActivityImage(activity.image);
    setActivityName(activity.name);
    setActivityDescription(activity.description);
    setActivityOwner(activity.username);
    setActivityId(activity._id);
  };

  const handleDelete = async () => {
    try {
      const url = `${serVer}/activity/${activityId}`;
      const response = await axios.delete(url);

      if (response.status === 200) {
        await refetch();
        setModal(false);
      } else {
        console.error("Error deleting activity:", response.data);
        setProduct("failed, try again");
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      setProduct("error, try again");
    }
  };

  return (
    <div className="activities">
      <div className="activities-top">
        <h1>All Activities</h1>
        <p>Sorted by recently posted</p>
      </div>
      {isLoading ? (
        <FetchLoader />
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <ul className="activitiesList">
          {activityList.map((activity, i) => (
            <li key={i}>
              <img src={activity.image} alt={activity.name} />
              <div>
                <h3>{activity.name}</h3>
                <button onClick={() => handleActivity(activity)}>
                  Read more
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {modal && (
        <div className="modal-overlay">
          <dialog open className="modal">
            <div className="modal-products">
              <h3>Activity Details</h3>
              <img src={activityImage} alt={activityName} />
              <div className="modal-products-details">
                <h3>{activityName}</h3>
                <div>
                  <h5>Description</h5>
                  <p>{activityDescription}</p>
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
    </div>
  );
};

async function fetchActivities() {
  try {
    const token = localStorage.getItem("farm-users-new");
    const url = `${serVer}/activitiesFetch`;
    const response = await axios.post(url, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching activities");
  }
}

export default Activities;
