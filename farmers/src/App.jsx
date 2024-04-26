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

const showNavigationRoutes = ["/home", "/profile", "/inventory", "/orders"];

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
          <Route path="/home" element={user && <Home />} />
          <Route path="/addProduct" element={user && <AddProduct />} />
          <Route path="/addActivity" element={user && <AddActivity />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/inventory" element={user && <Inventory />} />
          <Route path="/adminInventory" element={user && <AdminInventory />} />
          <Route path="/adminOrders" element={<AdminOrders />} />
          <Route path="/soldOrder" element={<AdminSold />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/orders" element={user && <Orders />} />
          <Route path="/profile" element={user && <Profile />} />
          <Route path="/calculator" element={user && <Calculator />} />
        </Routes>
      </Suspense>
      {showNavigation && <Navigation />}
    </>
  );
}

export default App;
