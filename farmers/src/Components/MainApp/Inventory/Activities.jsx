import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import FetchLoader from "../../Custom/FetchLoader";
import PropTypes from "prop-types";
import { fetchActivities } from "../../Hooks/useFetch";

const serVer = `https://farmers-hub-backend.vercel.app`;

const Activities = ({ user }) => {
  // receive user data props from inventory component
  useEffect(() => {
    const name = user[0];

    setUsername(name);
  }, [user]);

  const [modal, setModal] = useState(false);
  const [activityImage, setActivityImage] = useState(null);
  const [activityName, setActivityName] = useState(null);
  const [activityDescription, setActivityDescription] = useState(null);
  const [activityOwner, setActivityOwner] = useState(null);
  const [username, setUsername] = useState(null);
  const [activityId, setActivityId] = useState(null);
  const [product, setProduct] = useState(null);

  // fetch activities
  const {
    data: activityList,
    isLoading,
    isError,
    refetch,
  } = useQuery("activities", fetchActivities);

  if (isLoading) {
    return <FetchLoader />;
  }
  if (isError) {
    return <div>Error fetching data</div>;
  }

  // check is empty
  const hasActivityList = activityList?.length > 0;

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

      <ul className="activitiesList">
        {hasActivityList ? (
          activityList.map((activity, i) => (
            <li key={i}>
              <img src={activity.image} alt={activity.name} />
              <div>
                <h3>{activity.name}</h3>
                <button onClick={() => handleActivity(activity)}>
                  Read more
                </button>
              </div>
            </li>
          ))
        ) : (
          <div>
            No activities yet! <br />
            Farming activities will be displayed once created by a farmer
          </div>
        )}
      </ul>

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

Activities.propTypes = {
  user: PropTypes.string.isRequired,
};

export default Activities;
