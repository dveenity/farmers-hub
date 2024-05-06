import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuthContext } from "./Components/Hooks/useAuthContext";
import Genesis from "./Components/Genesis";
import Signup from "./Components/Authentication/Signup";
import Login from "./Components/Authentication/Login";
import Navigation from "./Components/Custom/Navigation";
import FetchLoader from "./Components/Custom/FetchLoader";

const Home = lazy(() => import("./Components/MainApp/Home/Home"));
const Inventory = lazy(() =>
  import("./Components/MainApp/Inventory/Inventory")
);
const Orders = lazy(() => import("./Components/MainApp/Orders/Orders"));
const Profile = lazy(() => import("./Components/MainApp/Profile/Profile"));
const AddProduct = lazy(() =>
  import("./Components/MainApp/Home/Admin/AddProduct")
);
const AddActivity = lazy(() =>
  import("./Components/MainApp/Home/Admin/AddActivity")
);
const AdminOrders = lazy(() =>
  import("./Components/MainApp/Orders/AdminOrders")
);
const Tutorial = lazy(() =>
  import("./Components/MainApp/Tutorial Hub/Tutorial")
);
const AdminSold = lazy(() =>
  import("./Components/MainApp/Home/Admin/AdminSold")
);
const Purchases = lazy(() => import("./Components/MainApp/Home/Purchases"));
const Chat = lazy(() => import("./Components/MainApp/Profile/Chat/Chat"));
const AdminInventory = lazy(() =>
  import("./Components/MainApp/Inventory/AdminInventory")
);
const Calculator = lazy(() =>
  import("./Components/MainApp/Calculator/Calculator")
);

const showNavigationRoutes = [
  "/home",
  "/profile",
  "/inventory",
  "/orders",
  "/adminInventory",
];

function App() {
  const { user } = useAuthContext();

  const location = useLocation();

  const showNavigation =
    showNavigationRoutes.includes(location.pathname) && user;

  return (
    <>
      <Suspense fallback={<FetchLoader />}>
        <Routes>
          <Route
            exact
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
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/addProduct"
            element={user ? <AddProduct /> : <Navigate to="/login" />}
          />
          <Route
            path="/addActivity"
            element={user ? <AddActivity /> : <Navigate to="/login" />}
          />
          <Route
            path="/tutorial"
            element={user ? <Tutorial /> : <Navigate to="/login" />}
          />
          <Route
            path="/inventory"
            element={user ? <Inventory /> : <Navigate to="/login" />}
          />
          <Route
            path="/adminInventory"
            element={user ? <AdminInventory /> : <Navigate to="/login" />}
          />
          <Route
            path="/adminOrders"
            element={user ? <AdminOrders /> : <Navigate to="/login" />}
          />
          <Route
            path="/soldOrder"
            element={user ? <AdminSold /> : <Navigate to="/login" />}
          />
          <Route
            path="/purchases"
            element={user ? <Purchases /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat"
            element={user ? <Chat /> : <Navigate to="/login" />}
          />
          <Route
            path="/orders"
            element={user ? <Orders /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/calculator"
            element={user ? <Calculator /> : <Navigate to="/login" />}
          />
        </Routes>
      </Suspense>
      {showNavigation && <Navigation />}
    </>
  );
}

export default App;
