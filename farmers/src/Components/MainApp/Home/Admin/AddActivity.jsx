import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import GoBack from "../../../Custom/GoBack";
import { CgNametag } from "react-icons/cg";
import { MdDescription } from "react-icons/md";
import { FaCamera } from "react-icons/fa";
import LoadingSpin from "../../../Custom/LoadingSpin";

const AddActivity = () => {
  const [send, setSend] = useState("Add Product");
  // State to store and display result data
  const [resultMessage, setResultMessage] = useState("");

  // store image in state
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // react form
  const form = useForm();
  const { register, handleSubmit, formState, reset } = form;
  const { errors, isSubmitting, isLoading } = formState;

  const onSubmit = async (data) => {
    console.log(data);
    try {
      setSend(LoadingSpin);
      // Retrieve the token from local storage
      const token = localStorage.getItem("farm-users");
      const url = "http://localhost:7001/addActivity";
      const { activityName, activityDescription } = data;

      const formData = new FormData();
      formData.append("image", imageFile); // Assuming productImage is an array of files

      formData.append("activityName", activityName);
      formData.append("activityDescription", activityDescription);

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Important: Set content type
        },
      });

      setResultMessage(response.data.message);

      reset();
      setImagePreview(null);

      setTimeout(() => {
        setResultMessage("");
      }, 3000);
    } catch (error) {
      console.log(error);
      setResultMessage("Failed");
      setTimeout(() => {
        setResultMessage("");
      }, 3000);
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

  // handle file upload
  const handleFileChange = (event) => {
    setLoading(true);
    const file = event.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setLoading(false);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="add-a-product">
      {/* Add Farm Activity */}
      <div className="add-form">
        <GoBack />
        <h4>Add Farm Activity</h4>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <div className="inputBox">
            <label htmlFor="activityName">
              <CgNametag />
            </label>
            <div className="inputBox-in">
              <input
                required
                type="text"
                id="activityName"
                {...register("activityName", {
                  required: "activity name is required",
                })}
              />
              <span>Activity Name</span>
              <p>{errors.activityName?.message}</p>
            </div>
          </div>
          <div className="inputBox">
            <label htmlFor="activityDescription">
              <MdDescription />
            </label>
            <div className="inputBox-in">
              <textarea
                required
                type="text"
                id="activityDescription"
                {...register("activityDescription", {
                  required: "Activity Description is required",
                })}
              />
              <span>Description</span>
              <p>{errors.activityDescription?.message}</p>
            </div>
          </div>
          <div className="fileBox">
            <label htmlFor="file">
              {loading ? ( // Display loading indicator while file is uploading
                <div>
                  <LoadingSpin />
                </div>
              ) : imagePreview ? (
                <img src={imagePreview} alt="Uploaded" />
              ) : (
                <>
                  Add Image
                  <FaCamera />
                </>
              )}
              <input
                required
                type="file"
                id="file"
                {...register("activityImage", {
                  required: "Product Image is required",
                })}
                onChange={handleFileChange}
              />
            </label>
            <p>{errors.activityImage?.message}</p>
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
