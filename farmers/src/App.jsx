import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./Components/Hooks/useAuthContext";
import Genesis from "./Components/Genesis";
import Signup from "./Components/Authentication/Signup";
import Login from "./Components/Authentication/Login";
import Home from "./Components/MainApp/Home/Home";
import Inventory from "./Components/MainApp/Inventory/Inventory";
import Orders from "./Components/MainApp/Orders/Orders";
import Profile from "./Components/MainApp/Profile/Profile";
import AddProduct from "./Components/MainApp/Home/Admin/AddProduct";
import AddActivity from "./Components/MainApp/Home/Admin/AddActivity";
import AdminOrders from "./Components/MainApp/Orders/AdminOrders";
import ProductCalendar from "./Components/MainApp/Calender/Calendar";
import AdminSold from "./Components/MainApp/Home/Admin/AdminSold";
import Purchases from "./Components/MainApp/Home/Purchases";
import Chat from "./Components/MainApp/Profile/Chat/Chat";
import AdminInventory from "./Components/MainApp/Inventory/AdminInventory";
import Calculator from "./Components/MainApp/Calculator/Calculator";

function App() {
  const { user } = useAuthContext();

  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route
            path="/"
            element={!user ? <Genesis /> : <Navigate to="/home" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/home" />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/home" />}
          />
          <Route
            path="/home"
            element={user ? <Home /> : <Navigate to="/Login" />}
          />
          <Route
            path="/addProduct"
            element={user ? <AddProduct /> : <Navigate to="/Login" />}
          />
          <Route
            path="/addActivity"
            element={user ? <AddActivity /> : <Navigate to="/Login" />}
          />
          <Route path="/calendar" element={<ProductCalendar />} />
          <Route
            path="/inventory"
            element={user ? <Inventory /> : <Navigate to="/Login" />}
          />
          <Route
            path="/adminInventory"
            element={user ? <AdminInventory /> : <Navigate to="/Login" />}
          />
          <Route path="/adminOrders" element={<AdminOrders />} />
          <Route path="/soldOrder" element={<AdminSold />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/chat" element={<Chat />} />
          <Route
            path="/orders"
            element={user ? <Orders /> : <Navigate to="/Login" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/Login" />}
          />
          <Route
            path="/calculator"
            element={user ? <Calculator /> : <Navigate to="/Login" />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
