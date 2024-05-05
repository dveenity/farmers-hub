import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const serVer = `https://farmers-hub-backend.vercel.app`;
import GoBack from "../../../Custom/GoBack";
// Retrieve the token from local storage
const token = localStorage.getItem("farm-users-new");

import { CgNametag } from "react-icons/cg";
import { MdDescription } from "react-icons/md";
import { IoPricetags } from "react-icons/io5";
import { FaCamera } from "react-icons/fa";
import LoadingSpin from "../../../Custom/LoadingSpin";

const AddProduct = () => {
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
    try {
      setSend(LoadingSpin);
      const url = `${serVer}/addProduct`;
      const { productName, productDescription, productPrice } = data;

      const formData = new FormData();
      formData.append("image", imageFile); // Assuming productImage is an array of files

      formData.append("productName", productName);
      formData.append("productDescription", productDescription);
      formData.append("productPrice", productPrice);

      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Important: Set content type
        },
      });

      setImagePreview(null);
      setResultMessage(response.data.message);

      setTimeout(() => {
        setResultMessage(null);
      }, 3000);
      reset();
    } catch (error) {
      console.log(error);
      setResultMessage("Failed");

      setTimeout(() => {
        setResultMessage(null);
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
      {/* Add Farm Products */}
      <div className="add-form">
        <GoBack />
        <h4>Add a new product</h4>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <div className="inputBox">
            <label htmlFor="productName">
              <CgNametag />
            </label>
            <div className="inputBox-in">
              <input
                required
                type="text"
                id="productName"
                {...register("productName", {
                  required: "product name is required",
                })}
              />
              <span>Product Name</span>
              <p>{errors.productName?.message}</p>
            </div>
          </div>
          <div className="inputBox">
            <label htmlFor="productDescription">
              <MdDescription />
            </label>
            <div className="inputBox-in">
              <textarea
                required
                type="text"
                id="productDescription"
                {...register("productDescription", {
                  required: "product description is required",
                })}
              />
              <span>Product Description</span>
              <p>{errors.productDescription?.message}</p>
            </div>
          </div>
          <div className="inputBox">
            <label htmlFor="productPrice">
              <IoPricetags />
            </label>
            <div className="inputBox-in">
              <input
                required
                type="number"
                id="productPrice"
                {...register("productPrice", {
                  required: "product name is required",
                })}
              />
              <span>Price</span>
              <p>{errors.productPrice?.message}</p>
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
                {...register("productImage", {
                  required: "Product Image is required",
                })}
                onChange={handleFileChange}
              />
            </label>
            <p>{errors.productImage?.message}</p>
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

export default AddProduct;
