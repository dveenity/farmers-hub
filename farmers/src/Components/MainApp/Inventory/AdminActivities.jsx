import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import FetchLoader from "../../Custom/FetchLoader";
import PropTypes from "prop-types";
import { fetchActivities } from "../../Hooks/useFetch";

const serVer = `https://farmers-hub-backend.vercel.app`;

const AdminActivities = ({ user }) => {
  // Access data passed via props from admin Inventory component
  const { name, username } = user;

  const [modal, setModal] = useState(false);
  const [activityImage, setActivityImage] = useState(null);
  const [activityName, setActivityName] = useState(null);
  const [activityDescription, setActivityDescription] = useState(null);
  const [activityOwner, setActivityOwner] = useState(null);
  const [activityId, setActivityId] = useState(null);
  const [product, setProduct] = useState(null);

  const {
    data: activityList,
    isLoading: activityLoading,
    isError: activityError,
    refetch: refetchActivities,
  } = useQuery("activities", fetchActivities, {
    enabled: !!user,
  });

  useEffect(() => {
    if (user) {
      refetchActivities(); // Refetch activities once user data is available
    }
  }, [user, refetchActivities]);

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
        await refetchActivities();
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

  if (activityLoading) {
    return <FetchLoader />;
  }

  if (activityError) {
    return <div>Error: {activityError}</div>;
  }

  // Filter activityList based on name
  const filteredActivity = activityList?.filter(
    (activity) => activity.username === name
  );

  // check if there is activity
  const hasActivities = filteredActivity?.length > 0;

  return (
    <div className="activities">
      <div className="activities-top">
        <h1>All Activities</h1>
        <p>Sorted by recently posted</p>
      </div>
      <ul className="activitiesList">
        {hasActivities ? (
          filteredActivity.map((activity, i) => (
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
            You have not posted an activity yet <br />
            Activities you post will appear here and you can manage them
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
                  {name === activityOwner && (
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

AdminActivities.propTypes = {
  user: PropTypes.string.isRequired,
};

export default AdminActivities;
