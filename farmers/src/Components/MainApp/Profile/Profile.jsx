import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosChatbubbles } from "react-icons/io";
import { TbBuildingEstate } from "react-icons/tb";
import { SiUnitednations } from "react-icons/si";
import { FaHome, FaPhone, FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import LoadingSpin from "../../Custom/LoadingSpin";
import FetchLoader from "../../Custom/FetchLoader";

// caching with react query
import { useQuery } from "react-query";

const serVer = `https://farmers-hub-backend.vercel.app`;

const Profile = () => {
  const [button, setButton] = useState("Save");

  const [addressNull, setAddressNull] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  // react form
  const form = useForm();
  const { register, handleSubmit, formState, reset } = form;
  const { errors, isSubmitting } = formState;

  const token = localStorage.getItem("farm-users-new");

  // fetch user data
  const fetchUser = async () => {
    const url = `${serVer}/home`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  // cache fetched data with react query
  const { data, isLoading, isError, refetch } = useQuery("user", fetchUser);

  // loading screen while fetching
  if (isLoading) return <FetchLoader />;
  if (isError) return <div>Error fetching user</div>;

  // destructing data from fetch
  const { name, role, email, image, address } = data;

  // address
  const userStreet = address ? address.street + "," : "";
  const userState = address ? address.state + "," : "";
  const userCountry = address ? address.country : "";
  const userContact = address ? `contact: ${address.phone}` : "";

  // open Model to edit profile
  const handleEdit = () => {
    setEditMode((prevView) => !prevView);
  };

  // edit and save new profile edit
  const onSubmit = async (data) => {
    const url = `${serVer}/update-profile`;
    const { name, street, state, country, phone } = data;

    try {
      setButton(<LoadingSpin />);

      await axios.put(
        url,
        {
          name,
          street,
          state,
          country,
          phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResultMessage("profileUpdated");

      setTimeout(() => {
        setResultMessage;
      }, 3000);

      setAddressNull(null);

      // Refresh user data to update
      await refetch();

      // clear form
      reset();

      handleEdit();
    } catch (error) {
      console.error("Error updating profile", error);
    } finally {
      setButton("Save");
    }
  };

  const onError = () => {
    setResultMessage("Failed to submit, check inputs and try again");

    // Hide the message after 2 seconds
    setTimeout(() => {
      setResultMessage("");
    }, 2000);
  };

  return (
    <div className="profile">
      <div>
        <h1>Profile</h1>
      </div>
      <div className="profile-details">
        <div className="profile-pic-sect">
          <img src={image} alt="profile-pic" />
          <label>
            Update profile image
            <input type="file" accept="image/png, image/jpg,image/jpeg" />
          </label>
        </div>
        <div className="profile-address">
          {editMode ? (
            <div className="modal-overlay">
              <dialog open className="modal">
                <form
                  onSubmit={handleSubmit(onSubmit, onError)}
                  noValidate
                  className="profile-form">
                  <div className="inputBox">
                    <label htmlFor="name">
                      <FaUser />
                    </label>
                    <div className="inputBox-in">
                      <input
                        required
                        type="text"
                        id="name"
                        {...register("name", {
                          required: "Full Name is required",
                        })}
                      />
                      <span>Full Name</span>
                      <p>{errors.name?.message}</p>
                    </div>
                  </div>
                  <h2>Address</h2>
                  <div className="inputBox">
                    <label htmlFor="street">
                      <FaHome />
                    </label>
                    <div className="inputBox-in">
                      <input
                        required
                        type="text"
                        id="street"
                        {...register("street", {
                          required: "Street is required",
                        })}
                      />
                      <span>Street</span>
                      <p>{errors.street?.message}</p>
                    </div>
                  </div>
                  <div className="inputBox">
                    <label htmlFor="state">
                      <TbBuildingEstate />
                    </label>
                    <div className="inputBox-in">
                      <input
                        required
                        type="text"
                        id="state"
                        {...register("state", {
                          required: "State is required",
                        })}
                      />
                      <span>State</span>
                      <p>{errors.state?.message}</p>
                    </div>
                  </div>
                  <div className="inputBox">
                    <label htmlFor="country">
                      <SiUnitednations />
                    </label>
                    <div className="inputBox-in">
                      <input
                        required
                        type="text"
                        id="country"
                        {...register("country", {
                          required: "Country is required",
                        })}
                      />
                      <span>Country</span>
                      <p>{errors.country?.message}</p>
                    </div>
                  </div>
                  <div className="inputBox">
                    <label htmlFor="phone">
                      <FaPhone />
                    </label>
                    <div className="inputBox-in">
                      <input
                        required
                        type="number"
                        id="phone"
                        {...register("phone", {
                          required: "Phone is required",
                        })}
                      />
                      <span>Phone</span>
                      <p>{errors.phone?.message}</p>
                    </div>
                  </div>
                  <div className="profile-buttons">
                    <button type="submit" disabled={isSubmitting}>
                      {button}
                    </button>
                    <button onClick={handleEdit}>close</button>
                  </div>
                </form>
                <p>Note! you can only edit Name and delivery address for now</p>
                <p>{resultMessage}</p>
              </dialog>
            </div>
          ) : (
            <div className="profile-details-in">
              <ul>
                <li>Name: {name}</li>
                <li>Account Type: {role}</li>
                <li>Email: {email}</li>
              </ul>
              <div>
                <h3>Delivery Address</h3>
                <div>
                  <p>
                    {userStreet}
                    {userState}
                    {userCountry}
                  </p>
                  <p>{userContact}</p>
                  <p>{addressNull}</p>
                </div>
                <Link onClick={handleEdit}>Edit profile</Link>
              </div>
            </div>
          )}
          <div className="profile-chat">
            <p>Are you a buyer or a Farmer... Click here to chat now</p>
            <Link to="/chat">
              Chat
              <IoIosChatbubbles />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
