import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import GoBack from "../../../Custom/GoBack";

const AddProduct = () => {
  const [send, setSend] = useState("Add Product");
  // State to store and display result data
  const [resultMessage, setResultMessage] = useState("");
  // State to store the user's role
  const [role, setRole] = useState("");

  // react form
  const form = useForm();
  const { register, handleSubmit, formState, reset } = form;
  const { errors, isSubmitting, isLoading } = formState;

  // Retrieve the token from local storage
  const token = localStorage.getItem("farm-users");

  useEffect(() => {
    const url = "http://localhost:7001/home";

    // Fetch the user's role from the server
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = response;
        setRole(data.role);
      } catch (error) {
        console.error("Error fetching user", error);
        setRole(error.data.role);
      }
    };

    fetchUserRole();
  }, [token]);

  const onSubmit = async (data) => {
    try {
      const url = "http://localhost:7001/addProduct";
      const { productName, productDescription, productPrice } = data;

      const response = await axios.post(
        url,
        { productName, productDescription, productPrice },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      reset();

      setResultMessage("Product Added");
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

  return role === "admin" ? (
    <div>
      <GoBack />
      {/* Add Farm Products */}
      <div>
        <h4>Add a new product</h4>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <div>
            <label htmlFor="productName">Product Name</label>
            <input
              required
              type="text"
              id="productName"
              {...register("productName", {
                required: "product name is required",
              })}
            />
            <p>{errors.productName?.message}</p>
          </div>
          <div>
            <label htmlFor="productDescription">Product Description</label>
            <textarea
              required
              type="text"
              id="productDescription"
              {...register("productDescription", {
                required: "product description is required",
              })}
            />
            <p>{errors.productDescription?.message}</p>
          </div>
          <div>
            <label htmlFor="productPrice">Product Price</label>
            <input
              required
              type="number"
              id="productPrice"
              {...register("productPrice", {
                required: "product name is required",
              })}
            />
            <p>{errors.productPrice?.message}</p>
          </div>
          <button type="submit" disabled={isSubmitting || isLoading}>
            {send}
          </button>
        </form>
        <p className="result">{resultMessage}</p>
      </div>
    </div>
  ) : (
    <div>Unauthorized</div>
  );
};

export default AddProduct;
