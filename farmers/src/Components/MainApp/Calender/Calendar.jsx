import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

//import react hook form for handling the form
import { useForm } from "react-hook-form";

//axios to post form data
import axios from "axios";

const serVer = `https://agro-hub-backend.onrender.com`;
import { useEffect, useState } from "react";
import GoBack from "../../Custom/GoBack";

const ProductCalendar = () => {
  const localizer = momentLocalizer(moment);

  // State to store the user's role
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");

  //result state
  const [result, setResult] = useState("");

  //calendar states
  const [calendarList, setCalendarList] = useState([]);

  // react form
  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    const url = `${serVer}/home`;

    // Retrieve the token from local storage
    const token = localStorage.getItem("farm-users");

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
        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching user", error);
        setRole(error.data.role);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const url = `${serVer}/calendar`;

    // Fetch calendar from DB
    const fetchCalendar = async () => {
      try {
        const response = await axios.get(url);

        const { data } = response;

        setCalendarList(data);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchCalendar();
  }, [username]);

  // map products from db into calender products
  const products = calendarList.map((calendarItem) => ({
    title: calendarItem.productName,
    start: new Date(calendarItem.startDate),
    end: new Date(calendarItem.endDate),
  }));

  // post new product calender details to database
  const onSubmit = async (data) => {
    try {
      const { productName, startDate, endDate } = data;
      const url = `${serVer}/productCalender`;

      await axios.post(url, { username, productName, startDate, endDate });

      setResult("New Product Calendar Added");

      setTimeout(() => {
        setResult("");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  //delete calender product
  const deleteCalenderProduct = async (calendarProducts) => {
    const calenderProductId = calendarProducts._id;
    try {
      const url = `${serVer}/deleteCalendar`;
      const deleteResponse = await axios.delete(url, { calenderProductId });

      console.log(deleteResponse);
    } catch (error) {
      console.log(error);
    }
  };

  const onError = () => {
    console.log("something went wrong");
  };

  // Render the calendar
  return (
    <div className="calendar">
      <GoBack />
      <h2>Product Availability Calendar</h2>
      <Calendar
        localizer={localizer}
        events={products}
        startAccessor="start"
        endAccessor="end"
        min={new Date(2024)}
        style={{ height: 350 }}
      />

      {role === "admin" && (
        <div>
          <div>
            <h3>Add New Product</h3>
            <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
              <div className="inputBox">
                <label htmlFor="name">Product Name</label>
                <input
                  required
                  type="text"
                  id="name"
                  {...register("productName", {
                    required: "Product Name is required",
                  })}
                />
                <p>{errors.productName?.message}</p>
              </div>
              <div className="inputBox">
                <label htmlFor="startDate">Start Date</label>
                <input
                  required
                  type="date"
                  id="startDate"
                  {...register("startDate", {
                    required: "start Date is required",
                  })}
                />
                <p>{errors.startDate?.message}</p>
              </div>
              <div className="inputBox">
                <label htmlFor="endDate">End Date</label>
                <input
                  required
                  type="date"
                  id="endDate"
                  {...register("endDate", { required: "end Date is required" })}
                />
                <p>{errors.endDate?.message}</p>
              </div>
              <button type="submit" disabled={isSubmitting}>
                Add New Calender
              </button>
            </form>
            <p>{result}</p>
          </div>
          <div>
            {calendarList
              .filter(
                (calendarProducts) => calendarProducts.postedBy === username
              )
              .map((calendarProducts, i) => (
                <li key={i}>
                  <p>{calendarProducts.productName}</p>
                  <p>from {calendarProducts.startDate}</p>
                  <p>to {calendarProducts.endDate}</p>
                  <button
                    onClick={() => deleteCalenderProduct(calendarProducts)}>
                    Delete
                  </button>
                </li>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCalendar;
