import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Navigate } from "react-router-dom";
import GoBack from "../../../Custom/GoBack";

const AddActivity = () => {
  const [send, setSend] = useState("Add Product");
  // State to store and display result data
  const [resultMessage, setResultMessage] = useState("");

  // react form
  const form = useForm();
  const { register, handleSubmit, formState, reset } = form;
  const { errors, isSubmitting, isLoading } = formState;

  const onSubmit = async (data) => {
    console.log(data);
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem("farm-users");
      const url = "http://localhost:7001/addActivity";
      const { activityName, activityDescription } = data;

      const response = await axios.post(
        url,
        { activityName, activityDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      reset();

      setResultMessage("New Activity Added");
    } catch (error) {
      console.log(error);
      setResultMessage("Failed");
    } finally {
      setSend("Add Products");
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
      <GoBack />
      {/* Add Farm Activity */}
      <div>
        <h4>Add Farm Activity</h4>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <div>
            <label htmlFor="activityName">Activity Name</label>
            <input
              required
              type="text"
              id="activityName"
              {...register("activityName", {
                required: "activity name is required",
              })}
            />
            <p>{errors.activityName?.message}</p>
          </div>
          <div>
            <label htmlFor="activityDescription">Activity Description</label>
            <textarea
              required
              type="text"
              id="activityDescription"
              {...register("activityDescription", {
                required: "Activity Description is required",
              })}
            />
            <p>{errors.activityDescription?.message}</p>
          </div>
          <button type="submit" disabled={isSubmitting || isLoading}>
            {send}
          </button>
        </form>
        <p className="result">{resultMessage}</p>
      </div>
    </div>
  );
};

export default AddActivity;
