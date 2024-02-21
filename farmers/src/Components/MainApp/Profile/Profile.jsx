import axios from "axios";

const serVer = `https://farmers-hub-backend.vercel.app`;
import Navigation from "../../Custom/Navigation";
import Logout from "../../Custom/Logout";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosChatbubbles } from "react-icons/io";
import { TbBuildingEstate } from "react-icons/tb";
import { SiUnitednations } from "react-icons/si";

//import react hook form for handling the form
import { useForm } from "react-hook-form";
import { FaHome, FaPhone, FaUser } from "react-icons/fa";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userMail, setUserMail] = useState("");
  const [userImage, setUserImage] = useState("");

  //user address outPut
  const [userStreet, setUserStreet] = useState("");
  const [userState, setUserState] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [userContact, setUserContact] = useState("");
  const [addressNull, setAddressNull] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  // react form
  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  // Retrieve the token from local storage
  const token = localStorage.getItem("farm-users");

  // Fetch the user's details from the server
  const fetchUser = useCallback(async () => {
    const url = `${serVer}/home`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = response;
      // set data properties into state
      setName(data.name);
      setUserName(data.username);
      setUserRole(data.role);
      setUserMail(data.email);
      setUserImage(data.image);

      //user address
      const { address } = data;

      //if address not present yet, display this
      if (!address) {
        setAddressNull("No address info yet, edit profile and add address");
      } else {
        setUserStreet(address.street + ",");
        setUserState(address.state + ",");
        setUserCountry(address.country);
        setUserContact("contact: " + address.phone);
      }
    } catch (error) {
      console.error("Error fetching user", error);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // open Model to edit profile
  const handleEdit = () => {
    setEditMode((prevView) => !prevView);
  };

  // edit and save new profile edit
  const onSubmit = async (data) => {
    const url = `${serVer}/update-profile`;
    const { name, street, state, country, phone } = data;

    try {
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
      setAddressNull(null);

      //refresh profile to update
      await fetchUser();

      handleEdit();
    } catch (error) {
      console.error("Error updating profile", error);
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
          <img src={userImage} alt="profile-pic" />
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
                      Save
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
                <li>Account Type: {userRole}</li>
                <li>Email: {userMail}</li>
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
            <p>
              Are you a stakeholder, partner or Farmer... Click here to chat now
            </p>
            <Link to="/chat">
              Chat
              <IoIosChatbubbles />
            </Link>
          </div>
        </div>
      </div>
      <Logout />
      <Navigation />
    </div>
  );
};

export default Profile;
