import axios from "axios";
import Navigation from "../../Custom/Navigation";
import Logout from "../../Custom/Logout";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//import react hook form for handling the form
import { useForm } from "react-hook-form";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userMail, setUserMail] = useState("");

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

  useEffect(() => {
    const url = "http://localhost:7001/home";

    // Retrieve the token from local storage
    const token = localStorage.getItem("farm-users");

    // Fetch the user's details from the server
    const fetchUser = async () => {
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
    };

    fetchUser();
  }, []);

  // open Model to edit profile
  const handleEdit = () => {
    setEditMode((prevView) => !prevView);
  };

  // edit and save new profile edit
  const onSubmit = async (data) => {
    const url = "http://localhost:7001/update-profile";
    const token = localStorage.getItem("farm-users");
    const { name, street, state, country, phone } = data;

    console.log(data);

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

      setTimeout(() => {
        handleEdit();
      }, 3000);
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
    <div>
      <h1>Profile</h1>
      <p>Welcome to your profile {userName}</p>
      <div>
        <div>
          <img alt="profile-pic" width="50" height="50" />
          <input type="file" />
        </div>
        <div>
          {editMode ? (
            <div className="modal-overlay">
              <dialog open className="modal">
                <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                  <div className="inputBox">
                    <label htmlFor="name">Name</label>
                    <input
                      required
                      type="text"
                      id="name"
                      {...register("name", { required: "Name is required" })}
                    />
                    <p>{errors.name?.message}</p>
                  </div>
                  <h2>Address</h2>
                  <div className="inputBox">
                    <label htmlFor="street">Street</label>
                    <input
                      required
                      type="text"
                      id="street"
                      {...register("street", {
                        required: "Street is required",
                      })}
                    />
                    <p>{errors.street?.message}</p>
                  </div>
                  <div className="inputBox">
                    <label htmlFor="state">State</label>
                    <input
                      required
                      type="text"
                      id="state"
                      {...register("state", {
                        required: "State is required",
                      })}
                    />
                    <p>{errors.state?.message}</p>
                  </div>
                  <div className="inputBox">
                    <label htmlFor="country">Country</label>
                    <input
                      required
                      type="text"
                      id="country"
                      {...register("country", {
                        required: "Country is required",
                      })}
                    />
                    <p>{errors.country?.message}</p>
                  </div>
                  <div className="inputBox">
                    <label htmlFor="phone">Phone</label>
                    <input
                      required
                      type="number"
                      id="phone"
                      {...register("phone", {
                        required: "Phone is required",
                      })}
                    />
                    <p>{errors.phone?.message}</p>
                  </div>
                  <button type="submit" disabled={isSubmitting}>
                    Save
                  </button>
                </form>
                <button onClick={handleEdit}>close</button>
                <p>Note! you can only edit Name and delivery address for now</p>
                <p>{resultMessage}</p>
              </dialog>
            </div>
          ) : (
            <div>
              <div>Name: {name}</div>
              <div>Account Type: {userRole}</div>
              <div>Email: {userMail}</div>
              <div>
                <p>Delivery Address</p>
                <div>
                  {userStreet}
                  {userState}
                  {userCountry}
                </div>
                <div>{userContact}</div>
              </div>
              <p>{addressNull}</p>
              <Link onClick={handleEdit}>Edit profile</Link>
            </div>
          )}
        </div>
      </div>
      <div>
        <p>More Features</p>
        <Link to="/purchases">Purchases</Link>
        <div>
          Are you a stakeholder, partner or Farmer... Click here to chat now
          <Link to="/chat">Chat</Link>
        </div>
      </div>
      <Logout />
      <Navigation />
    </div>
  );
};

export default Profile;
