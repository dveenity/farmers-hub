import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../Hooks/useAuthContext";
import LoadingSpin from "../Custom/LoadingSpin";
import Popup from "./Popup";

//import react hook form for handling the form
import { useForm } from "react-hook-form";

//axios to post form data
import axios from "axios";

import {
  FaEye,
  FaLock,
  FaRegEyeSlash,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import { FaUserGear } from "react-icons/fa6";
import { MdAttachEmail } from "react-icons/md";

const serVer = `https://farmers-hub-backend.vercel.app`;
const Signup = () => {
  const [showUserAgreement, setShowUserAgreement] = useState(false);

  // display agreement note after 5 seconds
  useEffect(() => {
    // Show the popup after 2.5 seconds
    const timer = setTimeout(() => {
      setShowUserAgreement(true);
    }, 2500);

    // Clear the timer when the component unmounts to avoid memory leaks
    return () => clearTimeout(timer);
  }, []);

  // react form
  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  const [send, setSend] = useState("Sign Up");
  // State to store and display result data
  const [resultMessage, setResultMessage] = useState("");
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const onSubmit = async (data) => {
    const url = `${serVer}/register`;

    try {
      // Reset error messages
      setResultMessage("");

      setIsLoading(true);
      setSend(LoadingSpin);

      const { name, username, email, password, role } = data;

      await axios
        .post(url, {
          name,
          username,
          email,
          password,
          role,
        })
        .then((result) => {
          if (result.status === 200) {
            // save the user to local storage
            localStorage.setItem("farm-users-new", result.data);

            //update the auth Context
            dispatch({ type: "LOGIN", payload: result });

            setIsLoading(false);
          } else {
            // Handle other scenarios or display the actual error message received from the server
            setResultMessage("invalid server response, please try again");

            // Hide the message after 2 seconds
            setTimeout(() => {
              setResultMessage("");
            }, 3000);
          }
        })
        .catch((error) => {
          setResultMessage(error.response.data);

          // Hide the message after 2 seconds
          setTimeout(() => {
            setResultMessage("");
          }, 3000);
        });
    } catch (error) {
      setResultMessage("cant connect to server, try again later");

      // Hide the message after 2 seconds
      setTimeout(() => {
        setResultMessage("");
      }, 5000);
    } finally {
      setIsLoading(false);
      setSend("Sign Up");
    }
  };

  const onError = () => {
    setResultMessage("Failed to submit, check inputs and try again");

    // Hide the message after 2 seconds
    setTimeout(() => {
      setResultMessage("");
    }, 2000);
  };

  //password
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
      <div className="authentication">
        <div>
          <h3>Sign Up</h3>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <div className="inputBox">
              <label htmlFor="name">
                <FaUser />
              </label>
              <div className="inputBox-in">
                <input
                  required
                  type="text"
                  id="name"
                  {...register("name", { required: "Full Name is required" })}
                />
                <span>Full Name</span>
                <p>{errors.name?.message}</p>
              </div>
            </div>
            <div className="inputBox">
              <label htmlFor="username">
                <FaUserCircle />
              </label>
              <div className="inputBox-in">
                <input
                  required
                  type="text"
                  id="username"
                  {...register("username", {
                    required: "Username is required",
                  })}
                />
                <span>Username</span>
                <p>{errors.username?.message}</p>
              </div>
            </div>
            <div className="inputBox">
              <label htmlFor="email">
                <MdAttachEmail />
              </label>
              <div className="inputBox-in">
                <input
                  required
                  type="email"
                  id="email"
                  {...register("email", { required: "Email is required" })}
                />
                <span>Email</span>
                <p>{errors.email?.message}</p>
              </div>
            </div>
            {/* Password input */}
            <div className="inputBox">
              <label htmlFor="password">
                <FaLock />
              </label>
              <div className="inputBox-in">
                <input
                  required
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <span>Password</span>
                {/* Toggle password visibility button */}
                <div
                  className="toggle"
                  type="button"
                  onClick={togglePasswordVisibility}>
                  {passwordVisible ? <FaRegEyeSlash /> : <FaEye />}
                </div>
                <p>{errors.password?.message}</p>
              </div>
            </div>
            {/* Role selection */}
            <div className="inputBox">
              <label htmlFor="role">
                <FaUserGear />
              </label>
              <div className="inputBox-in">
                <select
                  {...register("role", {
                    required: "role is required",
                  })}
                  id="role">
                  <option value="" disabled selected>
                    Select a role
                  </option>
                  <option value="admin">Farmer</option>
                  <option value="user">Buyer</option>
                </select>
                <p>{errors.role?.message}</p>
              </div>
            </div>
            <button type="submit" disabled={isSubmitting || isLoading}>
              {send}
            </button>
          </form>
          <p className="result">{resultMessage}</p>
          <div className="sign-log">
            <p>Already have an account?</p>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>{" "}
      {/* Render the user agreement popup if showUserAgreement is true */}
      {showUserAgreement && (
        <Popup onClose={() => setShowUserAgreement(false)} />
      )}
    </div>
  );
};

export default Signup;
