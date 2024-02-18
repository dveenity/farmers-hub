import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../Hooks/useAuthContext";
import LoadingSpin from "../Custom/LoadingSpin";

//import react hook form for handling the form
import { useForm } from "react-hook-form";

//axios to post form data
import axios from "axios";

import { FaEye, FaRegEyeSlash } from "react-icons/fa";

const Signup = () => {
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
    const url = "http://localhost:7001/register";

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
            localStorage.setItem("farm-users", result.data);

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
          console.log(error);
          setResultMessage(error.response.data);
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
      <h3>Sign Up</h3>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="inputBox">
          <label htmlFor="name">Full Name</label>
          <input
            required
            type="text"
            id="name"
            {...register("name", { required: "Full Name is required" })}
          />
          <p>{errors.name?.message}</p>
        </div>
        <div className="inputBox">
          <label htmlFor="username">Username</label>
          <input
            required
            type="text"
            id="username"
            {...register("username", { required: "Username is required" })}
          />
          <p>{errors.username?.message}</p>
        </div>
        <div className="inputBox">
          <label htmlFor="email">Email</label>
          <input
            required
            type="email"
            id="email"
            {...register("email", { required: "Email is required" })}
          />
          <p>{errors.email?.message}</p>
        </div>
        {/* Password input */}
        <div className="inputBox">
          <label htmlFor="password">Password</label>
          <div className="inputBox-in">
            <input
              required
              type={passwordVisible ? "text" : "password"}
              id="password"
              {...register("password", {
                required: "Password is required",
              })}
            />
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
          <label htmlFor="role">Role</label>
          <select {...register("role")} id="role">
            <option value="admin">Farmer</option>
            <option value="user">Stakeholder</option>
            <option value="user">Partner</option>
          </select>
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
  );
};

export default Signup;
